Template.profile.rendered = function() { 
	Meteor.call('getHangoutsJoinedCount', function(err, result){
		Session.set('hangoutsJoinedCount', result);
	});
};

Template.profile.helpers({
  profileImage: function() {
    return ReactiveMethod.call('userProfileImage', Meteor.userId());
  },
  username: function() {
    return ReactiveMethod.call('getUserName', Meteor.userId());
  },
  hangoutsJoinedCount: function() {
  	var totalHangoutsJoined = Session.get('hangoutsJoinedCount');
  	return totalHangoutsJoined;
  }
});

