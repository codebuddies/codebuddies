
Template.joinInfo.events({
  'click .signIn': function(event) {
  	Modal.hide('joinInfo');
    var options = {
      requestPermissions: ['identify', 'users:read']
    };
    Meteor.loginWithSlack(options);
  }
});