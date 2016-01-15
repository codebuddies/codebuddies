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
}

if (Meteor.isServer) {

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });
}
