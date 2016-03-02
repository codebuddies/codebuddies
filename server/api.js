Meteor.methods({

  userProfileImage: function(userId) {
    check(userId, String);
    if (userId != '') {
      var user = Meteor.users.findOne({_id: userId});
      return user.user_info.profile.image_48;
    } else {
      return '';
    }
  },

  getUserName: function(userId) {
    check(userId, String);
    if (userId != '') {
      var user = Meteor.users.findOne({_id: userId});
      return user.user_info.name;
    } else {
      return 'unknown';
    }
  },

  getUserCount: function() {
    return Meteor.users.find().count();
  },

  emailHangoutUsers: function(hangoutId) {
    var hangout = Hangouts.findOne(hangoutId);
    var hangout_topic = hangout.topic;
    var emails = hangout.email_addresses.join(",");
    var data = {
      to: emails,
      from: 'no-reply@codebuddies.org',
      html: '<html><head></head><body>Heads Up! Unfortunately, the hangout ' + hangout_topic + ' has been cancelled. </body></html>',
      subject: 'CodeBuddies Alert: Hangout - ' + hangout_topic + ' has been CANCELLED'
    }
    // let other method calls from same client to star running.
    // without needing to wait to send email
    this.unblock();
    
    return Email.send(data);
  },

  createHangout: function(data) {
    check(data, Match.ObjectIncluding({
      user_id: String,
      topic: String,
      description: String,
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      type: String
    }));
    var user = Meteor.users.findOne({_id: data.user_id});
    var user_email = user.user_info.profile.email;
    Hangouts.insert({
      user_id: data.user_id,
      topic: data.topic,
      description: data.description,
      start: data.start,
      end: data.end,
      type: data.type,
      users: [ data.user_id ],
      email_addresses: [ user_email ],
      timestamp: new Date()
    });
    return true;
  },

  deleteHangout: function (hangoutId) {
    check(hangoutId, String);
    var result = Meteor.call('emailHangoutUsers', hangoutId);
    console.log(result);
      //   if (result) {
      //    Hangouts.remove({_id: hangoutId});
      //    return true;
      //  } else {
      //    console.log("error from deleteHangout call: " + error);
      //    return false;
      //  }
  },

  setUserStatus: function(currentStatus) {
    check(currentStatus, String);
    Meteor.users.update({_id: Meteor.userId()}, {$set: {statusMessage: currentStatus, statusDate: new Date()}});
  },

  setHangoutStatus: function(hangoutStatus) {
    check(hangoutStatus, String);
    Meteor.users.update({_id: Meteor.userId()}, {$set: {statusHangout: hangoutStatus}});
  },

  addLearning: function(learningStatus) {
    check(learningStatus, String);
    Learnings.insert({
      text: learningStatus,
      owner: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().profile.name,
      timestamp: new Date(),
    });
  },

  getHangout: function(hangoutId) {
    check(hangoutId, String);
    return Hangouts.findOne(hangoutId);
  },

  getHangoutsCount: function() {
    return {hangoutsCount: Hangouts.find({}).count()};
  },

  addUserToHangout: function(hangoutId, userId) {
    check(hangoutId, String);
    check(userId, String);
    var user = Meteor.users.findOne({_id: userId});
    var user_email = user.user_info.profile.email;
    Hangouts.update({ _id: hangoutId },
      { $push: { users: userId, email_addresses: user_email }});
    return true;
  },

  removeUserFromHangout: function(hangoutId, userId) {
    check(hangoutId, String);
    check(userId, String);
    Hangouts.update({ _id: hangoutId },
      { $pull: { users: userId } });
    return true;
  }

});
