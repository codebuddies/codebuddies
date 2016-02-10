Template.hangoutItem.helpers({
  getType: function(type) {
    if (type == 'silent') {
      return 'fa-microphone-slash text-danger-color';
    } else if (type == 'teaching') {
      return 'fa-user text-warning-color';
    } else if (type == 'collaboration') {
      return 'fa-users text-success-color';
    }
  },
  getDate: function(hangout) {
    var user = ReactiveMethod.call('getUserName', hangout.user_id);
    return 'host ' +
            user +
            ' | ' +
            moment(new Date(hangout.start)).format('MMMM Do YYYY, h:mm a') +
            ' - ' +
            moment(new Date(hangout.end)).format('h:mm a') +
            ' | ' +
            hangout.users.length +
            ' joined';
  },
  isInProgress: function(hangout) {
    var date = new Date();
    return (date >= (new Date(hangout.start)) && date <= (new Date(hangout.end)));
  },
  isJoined: function() {
    return this.users.indexOf(Meteor.userId()) != -1;
  },
  getIsDone: function(hangout) {
    var currentDate = new Date();
    var hangoutDate = new Date(hangout.end);
    if (hangoutDate < currentDate) {
      var daysDiff = Math.round((currentDate - hangoutDate) / (1000 * 60 * 60 * 24));
      if (daysDiff == 0)
        return TAPi18n.__("mastered_today_time", {time: moment(hangoutDate).fromNow()}) + ' - ';
      else
        return TAPi18n.__("mastered_x_days_ago", {days: daysDiff}) + ' - ';
    } else {
      return '';
    }
  }
});

Template.hangoutItem.events({
  'click #join-hangout': function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_join_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('addUserToHangout', this._id, Meteor.userId(), function(error, result) {
        if (result) {
          sweetAlert({
            title: TAPi18n.__("you_are_awesome"),
            text: TAPi18n.__("looking_forward_to_see_you"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'info'
          });
        }
      });
    }
  },
  'click #leave-hangout': function() {
    if (this.user_id == Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("remove_owner_from_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'warning'
      });
    } else {
      Meteor.call('removeUserFromHangout', this._id, Meteor.userId(), function(error, result) {
        if (result) console.log('removed');
      });
    }
  }
});
