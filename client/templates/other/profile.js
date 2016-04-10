Template.profile.onCreated(function(){
  var username = FlowRouter.getParam('name');
  var title = username + " | Profile";
  DocHead.setTitle(title);
});


Template.profile.helpers({
  profileImage: function() {
    return ReactiveMethod.call('userProfileImage', Meteor.userId());
  },
  username: function() {
    return ReactiveMethod.call('getUserName', Meteor.userId());
  }
});
