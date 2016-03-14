

Template.profile.helpers({
  profileImage: function() {
    return ReactiveMethod.call('userProfileImage', Meteor.userId());
  },
  username: function() {
    return ReactiveMethod.call('getUserName', Meteor.userId());
  }
});

