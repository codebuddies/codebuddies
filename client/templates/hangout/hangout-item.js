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
    var tz = TimezonePicker.detectedZone();
    //console.log('getDate tz: ' + tz);
    //console.log('getDate hangout.start: '+ hangout.start);
    //console.log('getDate hangout.end: '+ hangout.end);
    //console.log('getDate this.timestamp' + this.timestamp);
    //console.log('getDate this.end' + this.end)
    return 'host ' +
            user +
            ' | ' +
            moment(hangout.start).tz(tz).format('MMMM Do YYYY, h:mm a z') +
            ' - ' +
            moment(hangout.end).tz(tz).format('h:mm a z') +
            ' | ' +
            hangout.users.length +
            ' joined';
  },
  isInProgress: function(hangout) {
    var date = new Date();
    //console.log('isInProgress date: ' + date);
    //console.log('isInProgress new Date hangout.start: ' + hangout.start );
    //console.log('isInProgress new Date hangout.end: ' + hangout.end );
    return (date >= (new Date(hangout.start)) && date <= (new Date(hangout.end)));
  },
  isJoined: function() {
    return this.users.indexOf(Meteor.userId()) != -1;
  },

  isHost:  function () {
    return this.user_id === Meteor.userId();
  },

  getIsDone: function(hangout) {
    var currentDate = new Date();
    //console.log('getIsDone currentDate:' + currentDate);
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
  },

  'click .delete-hangout': function (e, tpl) {
    sweetAlert({
      title: TAPi18n.__("delete_hangout_confirm"),
      text: TAPi18n.__("delete_hangout_text"),
      showCancelButton: true,
      cancelButtonText: TAPi18n.__("no_delete_hangout"),
      confirmButtonText: TAPi18n.__("yes_delete_hangout"),
      confirmButtonColor: "#d9534f",
      closeOnConfirm: false,
      closeOnCancel: true,
      type: 'warning'
    },
    function(isConfirm) {
      if(isConfirm) {
        // if user confirmed/selected yes, let's call the delete hangout method on the server
        Meteor.call('deleteHangout', tpl.data._id, function(error, result) {
          if (result) {
            swal("Poof!", "Your hangout has been successfully deleted!", "success");
          } else {
            swal("Oops something went wrong!",  "Try again", "error");
          }
        });

      }
      }

    );
  }
});
