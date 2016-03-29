Template.header.helpers({
  profileImage: function() {
    return ReactiveMethod.call('userProfileImage', Meteor.userId());
  },
  username: function() {
    return ReactiveMethod.call('getUserName', Meteor.userId());
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
