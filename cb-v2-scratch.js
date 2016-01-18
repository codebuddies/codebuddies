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
      var currentStatus = $(event.target).val();

      // Call the server method to update the current status
      Meteor.call('setUserStatus', currentStatus);
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
  Accounts.onCreateUser(function(user) {
    user.statusMessage = "";
    return user;
  });

  Meteor.methods({
    setUserStatus: function(currentStatus) {
      // Check the user is currently logged in
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      // Check the parameter is a string
      check(currentStatus, String);

      // Update the current users status
      Meteor.users.update({_id: Meteor.userId()}, {$set: {statusMessage: currentStatus}});
    }
  });

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });
}
