Template.header.onCreated(function(){
  this.subscribe("allNotifications");
});


Template.header.helpers({
  user: function() {
    return Meteor.user();
  },
  notificationCount:function(){
      return Notifications.find({'read':{$ne:Meteor.userId()}}).count();
  }
});

Template.header.events({
  'click .signIn': function(event) {
    var options = {
      requestPermissions: ['identify', 'users:read']
    };
    Meteor.loginWithSlack(options);
  },
  'click #signOut': function(event) {
    Meteor.logout(function(err) {
      FlowRouter.go("home");
    });
  }
});
