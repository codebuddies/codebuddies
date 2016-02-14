Template.learningItem.events({
  'click #like-btn': function(event) {
  	if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('incrementKudoCount', this._id, function(error, result) { });
    }
  }
});