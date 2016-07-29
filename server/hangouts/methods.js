Meteor.methods({
  createHangout: function(data) {
    check(data, Match.ObjectIncluding({
      topic: String,
      slug: String,
      description: String,
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      type: String,
    }));

    const loggedInUser = Meteor.user();
    if (!this.userId) {
      throw new Meteor.Error('Hangout.methods.createHangout.not-logged-in', 'Must be logged in to create new hangout.');
    }
    const hangout = {
      topic: data.topic,
      slug: data.slug,
      description: data.description,
      start: data.start,
      end: data.end,
      type: data.type,
      host:{
        id: loggedInUser._id,
        name: loggedInUser.username,
        avatar: loggedInUser.profile.avatar.default,
      },
      attendees:[],
      users:[loggedInUser._id],
      is_reminder_sent: false,
      views: 0,
      visibility: true,
      created_at: new Date()
    }

    const hangout_id = Hangouts.insert(hangout);

    // create slack message to channel
    const tz = "America/Los_Angeles";
    const host = loggedInUser.username;
    const hangout_type = data.type;
    const hangout_topic = data.topic;
    const hangout_desc = data.description;
    const hangout_url = Meteor.absoluteUrl('hangout'); // http://<ROOT_URL>/hangout/<hangout_id>
    const start_time = moment(data.start).tz(tz).format('MMMM Do YYYY, h:mm a z');
    const alert = {
      attachments: [
        {
          fallback: 'A new hangout has been scheduled. Visit' + Meteor.absoluteUrl() + '',
          color: '#1e90ff',
          pretext: `A new *${hangout_type}* hangout has been scheduled by <@${host}>!`,
          title: `${hangout_topic}`,
          title_link: `${hangout_url}/${hangout_id}`,
          mrkdwn_in: ['text', 'pretext', 'fields'],
          fields: [
            {
              title: 'Description',
              value: `_${hangout_desc}_`,
              short: true
            },
            {
              title: 'Date',
              value: `${start_time}`,
              short: true
            }
            ]
        }
        ]
    }
    // send Slack message to default channel (configured in Meteor settings)
    /* global hangoutAlert from /lib/functions.js */
    hangoutAlert(alert);
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

    const response = Meteor.call('emailHangoutUsers', data.hangoutId);
      if (!response) {
          throw new Meteor.Error("Error sending email!");
      } else {
        const actor = Meteor.user()
        if (actor._id === data.hostId) {

          Hangouts.update({_id: data.hangoutId},
                          {$set: { visibility: false} });
          return true;

        }else{
          if( !Roles.userIsInRole(this.userId,['admin','moderator']) ) {
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
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
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
                              start: data.start,
                              end: data.end,
                              type: data.type } });

      return true;

    }else if(Roles.userIsInRole(loggedInUser._id,['admin','moderator'])){

      Hangouts.update({_id: data.hangoutId},
                      {$set:{ topic: data.topic,
                              slug: data.slug,
                              description: data.description,
                              start: data.start,
                              end: data.end,
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
    if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {

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
