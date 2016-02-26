Template.learningItem.helpers({
  buttonStatus: function() {
    Meteor.call('userHasLikedItem', this._id, Meteor.userId(), function(error, result) { 
      if (error) {
        console.log(error);
      }
      Session.set('userHasLikedItem', result);
    });
    console.log(userHasLikedItem);
    if () {
      return "btn-unlike";
    } else {
      return "btn-like";
    }
  }
});

Template.learningItem.events({
  'click .btn-like': function(event) {
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

  'click .btn-unlike': function(event) {
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