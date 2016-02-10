Template.hangoutUser.helpers({
  profileImage: function(userId) {
    return ReactiveMethod.call('userProfileImage', userId);
  }
});
