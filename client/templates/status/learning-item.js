Template.learningItem.helpers({
  buttonStatus: function() {
    for(var index in Template.instance().data.hasLiked) {
      if(Template.instance().data.hasLiked[index] == Meteor.userId()) {
        return true;
      }
    }
    return false;
  }
});

Template.learningItem.events({
  'click .btn-like': function(event, template) {
  	if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('incrementKudoCount', this._id, Meteor.userId(), function(error, result) { });
    }
  },

  'click .btn-unlike': function(event, template) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('decrementKudoCount', this._id, Meteor.userId(), function(error, result) { });
    }
  }
});
