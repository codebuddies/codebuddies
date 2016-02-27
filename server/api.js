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

  createHangout: function(data) {
    check(data, Match.ObjectIncluding({
      user_id: String,
      topic: String,
      description: String,
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      type: String
    }));
    Hangouts.insert({
      user_id: data.user_id,
      topic: data.topic,
      description: data.description,
      start: data.start,
      end: data.end,
      type: data.type,
      users: [ data.user_id ],
      timestamp: new Date()
    });
    return true;
  },
  
  deleteHangout: function (hangoutId) {
    check(hangoutId, String);
    Hangouts.remove({_id: hangoutId});
    return true;

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
      kudos: 0
    });
  },

  incrementKudoCount: function(learningItemId, userId) {
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: 1 },
        $push: { hasLiked: userId }
      }
    );
  },

  decrementKudoCount: function(learningItemId, userId) {
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: -1 },
        $pull: { hasLiked: userId }
      }
    );
    return true;
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
    Hangouts.update({ _id: hangoutId },
      { $push: { users: userId } });
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
