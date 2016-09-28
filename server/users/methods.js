Meteor.methods({
  getUserDetails : function(userId){
    check(userId, String);
    return Meteor.users.findOne({_id:userId},
                                {fields: { emails: 0, services: 0, roles: 0, email: 0}});
  },
  setUserStatus: function(currentStatus) {
    check(currentStatus, String);
    if (!this.userId) {
      throw new Meteor.Error('users.methods.setUserStatus.not-logged-in', 'Must be logged in.');
    }
    Meteor.users.update({_id: Meteor.userId()},
                        {$set: {statusMessage: currentStatus, statusDate: new Date()}});
  },

  setHangoutStatus: function(hangoutStatus) {
    check(hangoutStatus, String);
    if (!this.userId) {
      throw new Meteor.Error('users.methods.setHangoutStatus.not-logged-in', 'Must be logged in.');
    }
    Meteor.users.update({_id: Meteor.userId()},
                        {$set: {statusHangout: hangoutStatus}});
  },
  getHangoutsJoinedCount: function(userId) {
    check(userId, String);
    return Hangouts.find({users:{$elemMatch:{$eq:userId}},'visibility':{$ne:false}}).count();
  }
});
