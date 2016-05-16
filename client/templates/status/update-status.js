Template.updateStatus.helpers({
  isWorking: function(type) {
    return type == 'working';
  }
});

Template.updateStatus.events({
  'click #update-working-btn': function(event) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      var currentStatus = $('#working-text').val();
      Meteor.call('setUserStatus', currentStatus, function(error, result) { });
      $('#working-text').val('');
    }
  },
  'click #update-learned-btn': function(event) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      var learningStatus = $('#learned-text').val();
      var data = {
        user_id: Meteor.userId(),
        username:Meteor.user().profile.name,
        title:learningStatus,
      }
      Meteor.call("addLearning", data, function(error, result) { });
      $('#learned-text').val('');
    }
  },
  'click .btn-hangout-status': function(event) {
    var currentType = $(event.currentTarget).attr('data-type');
    if (currentType !== undefined)
      Meteor.call("setHangoutStatus", currentType, function(error, result) { });
  }
});
