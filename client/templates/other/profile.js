Template.profile.onCreated(function(){
  var username = FlowRouter.getParam('name');
  var title = username + " | Profile";
  DocHead.setTitle(title);
});

Template.profile.helpers({
  userInfo: function() {
		var userId = FlowRouter.getParam('userId');
		return ReactiveMethod.call('getUserDetails',userId);
  },
  hangoutsJoinedCount: function() {
		var userId = FlowRouter.getParam('userId');
  	return ReactiveMethod.call('getHangoutsJoinedCount',userId)
  }
});
