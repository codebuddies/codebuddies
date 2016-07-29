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

Meteor.methods({
  removeUser:function(userId, incident){
    check(userId, String);
    check(incident, {
      action: String,
      matter: String,
      matter_detail: String
    });
    const user = Meteor.users.findOne({_id:userId});
    const accessToken = user.services.slack.accessToken;

    if (this.userId !== userId) {
      throw new Meteor.Error('Users.methods.removeUser.not-a-currentuser-in', 'Must be logged in to Delete an account.');
    }

    //removing access for codebuddies slack app
    const result = authRevoke(accessToken);
    if(result.ok){
      //archiving user and incident report
      const auid = ArchivedUsers.insert({user:user, incident:incident});
      //removing user
      Meteor.users.remove({_id: userId})

    }
  }
});

Meteor.methods({
  deleteUserAcount:function(data){
     check(data, {
       reason: String,
       detail: String
     });

     if (!this.userId) {
       throw new Meteor.Error('Users.methods.deleteUserAcount.not-logged-in', 'Must be logged in to Delete an account.');
     }

     const loggedInUser = Meteor.user();
     const userId = loggedInUser._id;
     const email = loggedInUser.email;

     const incident = {
       action: "SELF-DELETE",
       matter: data.reason,
       matter_detail: data.detail
     }

     Meteor.call('removeHangouts', userId);
     Meteor.call('removeLearnings', userId);
     Meteor.call('removeRSVPnotifications', userId);

     if(Meteor.settings.isModeProduction){
       removeUserFromMailingList(email);
     }


     Meteor.call('removeUser', userId, incident);


     return true;
  }
});
