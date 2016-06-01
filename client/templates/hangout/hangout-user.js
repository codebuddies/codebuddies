Template.hangoutUser.helpers({
  profileImage: function(userId) {
    return ReactiveMethod.call('userProfileImage', userId);
  },
  userInfo: function() {
    var userId = FlowRouter.getParam('userId');
    return ReactiveMethod.call('getUserDetails',userId);
  }

});
