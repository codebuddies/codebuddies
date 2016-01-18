if (Meteor.isClient) {

  Meteor.subscribe('userStatus');

  Template.activeUsers.helpers({
    usersOnline:function(){
      return Meteor.users.find({ "status.online": true })
    },
    usersOnlineCount:function(){
      //event a count of users online too.
    return Meteor.users.find({ "status.online": true }).count();
    }
  });

  Template.activeUsers.events({
    'focusout textarea#current_status': function(event) {
        //console.log(event.target.currentStatus.value);
      var currentStatusVar = $(event.target).val();
      console.log(currentStatusVar);
      Meteor.call(setUserStatus, currentStatusVar);

    }
  });
  
  Template.activeUsers.labelClass = function() {
  if (this.status.idle)
    return "label-warning"
  else if (this.status.online)
    return "label-success"
  else
    return "label-default"
  };

  //configure the accounts UI to use usernames instead of email addresses:
   Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
   });
   
   Meteor.methods({
    setUserStatus: function(currentStatusVar) {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var currentUserId = Meteor.userId();
        Users.insert({
            currentStatusVar: currentStatusVar,
            createdBy: currentUserId
        });
    }
  });
}

if (Meteor.isServer) {
  Accounts.onCreateUser(function(user) {
    user.setUserStatus = "";
    return user;
  });

  

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });
}
