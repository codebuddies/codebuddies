Template.profile.onCreated(function(){
  var username = FlowRouter.getParam('name');
  var title = username + " | Profile";
  DocHead.setTitle(title);
});

Template.profile.helpers({
  userInfo: function() {
		var userId = FlowRouter.getParam('userId');
    console.log(ReactiveMethod.call('getUserDetails',userId));
		return ReactiveMethod.call('getUserDetails',userId);
  },
  hangoutsJoinedCount: function() {
		var userId = FlowRouter.getParam('userId');
  	return ReactiveMethod.call('getHangoutsJoinedCount',userId)
  },
  editMode: function() {
    return Session.get("editMode");
  },
  isCurrentUserProfile: function(currentUser) {
    return currentUser && currentUser._id == FlowRouter.getParam('userId');
  },
});

Template.profile.events({
  'click .editProfile': function() {
    Session.set('editMode',true);
  },
  'click #cancelProfileEdit': function() {
    Session.set('editMode',false);
  },
});
