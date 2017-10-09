Meteor.methods({
  removeUser:function(userId, incident){
    check(userId, String);
    check(incident, {
      action: String,
      matter: String,
      detail: String
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
      const auid = ArchivedUsers.insert({user:user, incident:incident, archived_at: new Date()});
      //removing user
      Meteor.users.remove({_id: userId})

    }
  }
});

Meteor.methods({
  deleteUserAccount:function(data){
     check(data, {
       reason: String,
       detail: String
     });

     if (!this.userId) {
       throw new Meteor.Error('Users.methods.deleteUserAccount.not-logged-in', 'Must be logged in to Delete an account.');
     }

     const loggedInUser = Meteor.user();
     const userId = loggedInUser._id;
     const email = loggedInUser.email;

     const incident = {
       action: "SELF-DELETE",
       matter: data.reason,
       detail: data.detail
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

Meteor.methods({
  archivedUserCount : function(){
    return ArchivedUsers.find().count();
  }
});
