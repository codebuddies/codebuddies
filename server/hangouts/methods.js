import {tweetHangout} from '../twitter/methods.js';

Meteor.methods({
  createHangout: function(data) {
    check(data, Match.ObjectIncluding({
      topic: String,
      slug: String,
      description: String,
      description_in_quill_delta: Match.ObjectIncluding({
        ops: Match.Any
      }),
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      duration: Number,
      type: String,
      groupId: String
    }));

    const loggedInUser = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.createHangout.not-logged-in', 'Must be logged in to create new hangout.');
    }

    let group;
    //check for group
    if (data.groupId == 'CB') {
      group = {_id: 'CB', title: 'CB', slug: 'CB' };
    } else {
      const temp_item = StudyGroups.findOne({'_id': data.groupId }, { 'exempt_form_default_permission': 1 });

      // check for exempt_form_default_permission
      if (temp_item && temp_item.exempt_form_default_permission) {

        //check if user is a member
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['owner','admin','moderator','member'], data.groupId)) {
          throw new Meteor.Error(403, "Access denied");
        }else {
          group = StudyGroups.findOne({'_id': data.groupId }, { 'title': 1, 'slug': 1 });
        }

      } else {

        //check if user has permission
        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['owner','admin','moderator'], data.groupId)) {
          throw new Meteor.Error(403, "Access denied");
        }else {
          group = StudyGroups.findOne({'_id': data.groupId }, { 'title': 1, 'slug': 1 });
        }

      }

    }// if ends






    let createdAt = new Date();
    let createdAtPlusTwoHour = new Date(createdAt.getTime() + (2*1000*60*60));
    const reminder = data.start <= createdAtPlusTwoHour ? true : false;


    var hangout = {
      topic: data.topic,
      slug: data.slug,
      description: data.description,
      description_in_quill_delta: data.description_in_quill_delta,
      start: data.start,
      end: data.end,
      duration: data.duration,
      type: data.type,
      host:{
        id: loggedInUser._id,
        name: loggedInUser.username,
        avatar: loggedInUser.profile.avatar.default,
      },
      attendees:[],
      email_addresses: [loggedInUser.email],
      users:[loggedInUser._id],
      day_reminder_sent: reminder,
      hourly_reminder_sent: reminder,
      followup_email_sent: false,
      views: 0,
      visibility: true,
      created_at: createdAt,
      group: {
        id: group._id,
        title: group.title,
        slug: group.slug
      }
    }

    // console.log(hangout);

    const hangout_id = Hangouts.insert(hangout);
    hangout._id = hangout_id;

    //tweet new hangout
    tweetHangout(hangout);


    slackNotification(hangout, "NEW");
    return true;
  },
  deleteHangout: function (data) {
    check(data, {
      hangoutId: String,
      hostId: String,
      hostUsername: String
    });

    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.deleteHangout.not-logged-in', 'Must be logged in to delete hangout.');
    }

    const hangout = Hangouts.findOne(data.hangoutId);
    const response = emailNotification(hangout,"DELETED");

      if (!response) {
          throw new Meteor.Error("Error sending email!");
      } else {
        const actor = Meteor.user()
        if (actor._id === data.hostId) {

          Hangouts.update({_id: data.hangoutId},
                          {$set: { visibility: false} });
          return true;

        }else{
          if( !Roles.userIsInRole(this.userId,['admin','moderator'], 'CB') ) {
            throw new Meteor.Error('Hangout.methods.deleteHangout.accessDenied', 'Cannot delete hangout, Access denied');
          }

          Hangouts.update({_id: data.hangoutId},
                          {$set: { visibility:false }});

          const notification = {
            actorId : actor._id,
            actorUsername : actor.username,
            subjectId : data.hostId,
            subjectUsername : data.hostUsername,
            hangoutId : data.hangoutId,
            createdAt : new Date(),
            read:[actor._id],
            action : "deleted ",
            icon : "fa-times",
            type : "hangout delete",
          }
          Notifications.insert(notification);
          return true;
        }
      }


  },
  editHangout: function(data) {
    check(data, Match.ObjectIncluding({
      topic: String,
      slug: String,
      description: String,
      description_in_quill_delta: Match.ObjectIncluding({
        ops: Match.Any
      }),
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      duration: Number,
      type: String
    }));

    check(data.hangoutId, String);

    const loggedInUser = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.editHangout.not-logged-in', 'Must be logged in to edit hangout.');
    }
    const hangout = Hangouts.findOne({_id: data.hangoutId});

    if(hangout.host.id === loggedInUser._id){

      Hangouts.update({_id: data.hangoutId},
                      {$set:{ topic: data.topic,
                              slug: data.slug,
                              description: data.description,
                              description_in_quill_delta: data.description_in_quill_delta,
                              start: data.start,
                              end: data.end,
                              duration: data.duration,
                              type: data.type } });

      return true;

    }else if(Roles.userIsInRole(loggedInUser._id,['admin','moderator'], 'CB')){

      Hangouts.update({_id: data.hangoutId},
                      {$set:{ topic: data.topic,
                              slug: data.slug,
                              description: data.description,
                              description_in_quill_delta: data.description_in_quill_delta,
                              start: data.start,
                              end: data.end,
                              duration: data.duration,
                              type: data.type }});

      const notification = {
        actorId : loggedInUser._id,
        actorUsername : loggedInUser.username,
        subjectId : hangout.host.id,
        subjectUsername : hangout.host.name,
        hangoutId : hangout._id,
        createdAt : new Date(),
        read:[loggedInUser._id],
        action : "edited",
        icon : "fa-pencil-square-o",
        type : "hangout edit",
      }
      Notifications.insert(notification);

      return true;

    }else{
      throw new Meteor.Error('Hangouts.methods.editHangout.accessDenied','Cannot update hangout, Access denied');
    }


  },
  getHangout: function(hangoutId) {
    check(hangoutId, String);
    if (Roles.userIsInRole(this.userId, ['admin','moderator'], 'CB')) {

      return Hangouts.findOne({_id:hangoutId});

    } else {

      return Hangouts.findOne({_id:hangoutId,'visibility': { $ne: false } });

    }

  },

  getHangoutsCount: function() {
    return {hangoutsCount: Hangouts.find({}).count()};
  },

  addUserToHangout: function(data) {
    check(data,{
      hangoutId: String,
      hostId: String
    });

    const loggedInUser = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.addUserToHangout.not-logged-in', 'Must be logged in to RSVP.');
    }

    const attendee = {
      id: loggedInUser._id,
      name: loggedInUser.username,
      avatar: loggedInUser.profile.avatar.default,
    }

    Hangouts.update({ _id: data.hangoutId },
                    { $addToSet:{ attendees: attendee,
                                  users: loggedInUser._id,
                                  email_addresses: loggedInUser.email } });

    const date = new Date();
    RSVPnotifications.upsert({hangoutId : data.hangoutId, createorId : data.hostId, seen : false},
                             {$set: {date: date},
                              $inc: {count: 1} });
    return true;
  },
  removeUserFromHangout: function(data) {
    check(data,{
      hangoutId: String,
      hostId: String
    });

    const loggedInUser = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.removeUserFromHangout.not-logged-in', 'Must be logged in to RSVP.');
    }

    const attendee = {
      id: loggedInUser._id,
      name: loggedInUser.username,
      avatar: loggedInUser.profile.avatar.default,
    }

    Hangouts.update({ _id: data.hangoutId },
                    {$pull:{  attendees: attendee,
                              users: loggedInUser._id,
                              email_addresses: loggedInUser.email} });

    const date = new Date();
    RSVPnotifications.update({hangoutId : data.hangoutId, createorId : data.hostId, seen : false},
                             {$set: { date: date },
                              $inc: { count: -1 } });
    return true;
  },
  reportHangout : function(report){
    check(report, {
      category: String,
      hangoutId: String,
      reporterId: String
    });

    const actor = Meteor.user();
    const host = Hangouts.findOne({_id:report.hangoutId}).host;
    if(report.reporterId !== actor._id){
      throw new Meteor.Error(500, "You are trying do something fishy.")
    }

    const matter = " as " + report.category + ".";
    const notification = {
      actorId : actor._id,
      actorUsername : actor.username ,
      subjectId : host.id,
      subjectUsername : host.name,
      hangoutId : report.hangoutId,
      createdAt : new Date(),
      read:[actor._id],
      action : 'reported',
      matter : matter,
      icon : 'fa-exclamation-circle',
      type : 'reported hangout'
    }

    Notifications.insert(notification);
    return true;
  },
  incHangoutViewCount : function(hangoutId){
    check(hangoutId, String);
    Hangouts.update({_id:hangoutId}, {$inc:{views:1}});
  },
});


Meteor.methods({
  removeHangouts:function(userId){
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error('Hangout.methods.removeHangouts.not-logged-in', 'Must be logged in to Remove Hangouts.');
    }

    return Hangouts.update({'host.id': userId},
                           {$set: {visibility: false}},
                           {multi: true});


  }
});

Meteor.methods({
  endHangout:function(data){
    check(data.hangoutId, String);

    const loggedInUser = Meteor.user();
    const date = new Date();
    const end = date.setMinutes(date.getMinutes());
    const oneMinuteAgo = new Date(end - 60000)
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.endHangout.not-logged-in', 'Must be logged in to end hangout.');
    }
    const hangout = Hangouts.findOne({_id: data.hangoutId});

    if(hangout.host.id === loggedInUser._id){

      Hangouts.update({_id: data.hangoutId},
                      {$set:{ end: oneMinuteAgo,
                              url: "" } });

      return true;

    }else if(Roles.userIsInRole(loggedInUser._id,['admin','moderator'], 'CB')){

      Hangouts.update({_id: data.hangoutId},
                      {$set:{ end: oneMinuteAgo,
                              url: "" } });

      const notification = {
        actorId : loggedInUser._id,
        actorUsername : loggedInUser.username,
        subjectId : hangout.host.id,
        subjectUsername : hangout.host.name,
        hangoutId : hangout._id,
        createdAt : new Date(),
        read:[loggedInUser._id],
        action : "ended",
        icon : "fa-stop",
        type : "hangout end",
      }
      Notifications.insert(notification);

      return true;

    } else {
      throw new Meteor.Error('Hangouts.methods.endHangout.accessDenied','Cannot end hangout, Access denied');
    }


  }
});
