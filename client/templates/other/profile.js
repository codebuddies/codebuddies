Template.profile.rendered = function() {
	Meteor.call('getHangoutsJoinedCount', function(err, result){
		Session.set('hangoutsJoinedCount', result);
	});
};

Template.profile.onCreated(function(){
  var username = FlowRouter.getParam('name');
  var title = username + " | Profile";
  DocHead.setTitle(title);
});

Template.profile.helpers({
  user: function() {
		return ReactiveMethod.call('getUserDetails',FlowRouter.getParam('userId'));
  },
  hangoutsJoinedCount: function() {
  	var totalHangoutsJoined = Session.get('hangoutsJoinedCount');
  	return totalHangoutsJoined;
  }
});
