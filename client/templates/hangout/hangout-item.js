Meteor.startup(function() {
  /*Use reactive-var to make sure inProgress hangouts change automatically*/
  reactiveDate = {
    nowMinutes: new ReactiveVar(new Date)
  };

  setInterval(function() {
    reactiveDate.nowMinutes.set(new Date);
  }, 60 * 1000); // every minute
  /*Hangout Links*/


});

Template.hangoutItem.rendered =function() {

  $('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');

};

Template.registerHelper("hangoutOwner", function(ownerid){
  if(Meteor.userId() === ownerid){
      return true;
  }else {
      return false;
  }

});



Template.hangoutItem.helpers({
  getDescriptionTruncated: function(description) {
      return description.substring(0,201)+"...";
    },
  isInProgress: function(hangout) {

    return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;

    //return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;

  },
  completed: function(hangout) {
        return reactiveDate.nowMinutes.get() > hangout.end;
  },
  isJoined: function() {
    return this.users.indexOf(Meteor.userId()) != -1;
  },

  upcomingTime: function(hangout) {
    var startDate = new Date(hangout.start);
    var currentDate = new Date();
    if (startDate > currentDate) {
          return TAPi18n.__("upcoming_time", {
          time: moment(startDate).fromNow()
        });
    }

  },
  getIsDone: function(hangout) {
    var currentDate = new Date();
    //console.log('getIsDone currentDate:' + currentDate);
    var hangoutDate = new Date(hangout.end);
    if (hangoutDate < currentDate) {
      var daysDiff = Math.round((currentDate - hangoutDate) / (1000 * 60 * 60 * 24));
      if (daysDiff == 0)
        return TAPi18n.__("mastered_today_time", {
          time: moment(hangoutDate).fromNow()
        });
      else
        return TAPi18n.__("mastered_x_days_ago", {
          days: daysDiff
        });
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

      const data = {
        hangoutId: this._id,
        hostId: this.host.id,
      }
      Meteor.call('addUserToHangout', data, function(error, result) {
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
    if (this.host.id == Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("remove_owner_from_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'warning'
      });
    } else {

      const data = {
        hangoutId: this._id,
        hostId: this.host.id,
      }

      Meteor.call('removeUserFromHangout', data, function(error, result) {
        if (result) console.log('removed');
      });
    }
  },
  'click .clone-hangout': function(e, hangout) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      //var start_time_reverted = moment(hangout.data.start).format('MM/DD/YYYY h:mm A');
      //var end_time_reverted = moment(hangout.data.end).format('MM/DD/YYYY h:mm A');

      console.log(hangout.data._id + ' this is a cloned hangout id');
      Session.set('hangoutId', hangout.data._id);

      Modal.show('cloneHangoutModal');
      $('#clone-hangout-modal #topic').val(hangout.data.topic);
      $('#clone-hangout-modal #description').val(hangout.data.description);
      $('#clone-hangout-modal input[value=' + hangout.data.type + ']').prop("checked", true);
      //$('#clone-hangout-modal #start-date-time').val(start_time_reverted);
      //$('#clone-hangout-modal #end-date-time').val(end_time_reverted);
      //console.log(start_time_reverted);
      //console.log(end_time_reverted);
    }
  },
  'click .report-hangout': function(e, hangout) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {

      Session.set('hangoutId', hangout.data._id);
      Session.set('hostId', hangout.data.host.id);
      Session.set('hostUsername', hangout.data.creator);

      Modal.show('reportHangoutModal');

    }
  }
});
