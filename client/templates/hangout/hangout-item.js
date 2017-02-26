Meteor.startup(function() {
  /*Use reactive-var to make sure inProgress hangouts change automatically*/
  reactiveDate = {
    nowMinutes: new ReactiveVar(new Date)
  };

  setInterval(function() {
    reactiveDate.nowMinutes.set(new Date);
  }, 60 * 1000); // every minute

});

Template.hangoutItem.rendered =function() {

  $('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');

  $('.hangout-item').on('mouseenter', function(){
    $(this).find('.hangout-front').hide();
    $(this).find('.hangout-back').show();
    $(this).addClass('flipped');
  }).on('mouseleave', function() {
    $(this).find('.hangout-front').show();
    $(this).find('.hangout-back').hide();
    $(this).removeClass('flipped');
  });

};

Template.registerHelper("hangoutOwner", function(ownerid){
  if(Meteor.userId() === ownerid){
      return true;
  }else {
      return false;
  }

});


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
  getHostId: function(hangout) {
    return hangout.host.id;
  },
  getHostName: function(hangout) {
    return hangout.host.name;
  },
  getDate: function(hangout) {
    var tz = TimezonePicker.detectedZone();
    //console.log('getDate tz: ' + tz);
    //console.log('getDate hangout.start: '+ hangout.start);
    //console.log('getDate hangout.end: '+ hangout.end);
    //console.log('getDate this.timestamp' + this.timestamp);
    //console.log('getDate this.end' + this.end)
    return moment(hangout.start).tz(tz).format('ddd MMMM Do YYYY, h:mm a z') +
      ' - ' +
      moment(hangout.end).tz(tz).format('MMMM Do h:mm a z') +
      ' | ' +
      hangout.attendees.length +
      ' joined';
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

  // upcomingTime: function(hangout) {
  //   var startDate = new Date(hangout.start);
  //   var currentDate = new Date();
  //   if (startDate > currentDate) {
  //         return TAPi18n.__("upcoming_time", {
  //         time: moment(startDate).fromNow()
  //       });
  //   }

  // },
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
  },
  truncate: function(topic){
    return topic.truncate()
  },
  getDescriptionTruncated: function(description) {
    if(description.length > 201){
      return description.substring(0,201)+"...";
    }
    else {
      return description.substring(0,201)
    }
  }
});

Template.hangoutItem.events({
  'click .join-hangout': function() {
    console.log('clicked on join hangout')
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_join_hangout"),
        confirmButtonText: TAPi18n.__("sign_in_with_slack"),
        type: 'info'
      },
      function(){
        var options = {
          requestPermissions: ['identify', 'users:read']
        };
        Meteor.loginWithSlack(options);
      }
    );
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
        confirmButtonText: TAPi18n.__("sign_in_with_slack"),
        type: 'info'
      },
      function(){
        var options = {
          requestPermissions: ['identify', 'users:read']
        };
        Meteor.loginWithSlack(options);
      }
    );
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
        confirmButtonText: TAPi18n.__("sign_in_with_slack"),
        type: 'info'
      },
      function(){
        var options = {
          requestPermissions: ['identify', 'users:read']
        };
        Meteor.loginWithSlack(options);
      }
    );
    } else {

      Session.set('hangoutId', hangout.data._id);
      Session.set('hostId', hangout.data.host.id);
      Session.set('hostUsername', hangout.data.creator);

      Modal.show('reportHangoutModal');

    }
  },
  'click #end-hangout': function(){

    const data = {
      hangoutId: this._id,
    }

    sweetAlert({
        type: 'warning',
        title: TAPi18n.__("end_hangout_confirm"),
        cancelButtonText: TAPi18n.__("no_end_hangout"),
        confirmButtonText: TAPi18n.__("yes_end_hangout"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: false,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();
        // if user confirmed/selected yes, let's call the delete hangout method on the server

        Meteor.call('endHangout', data, function(error, result) {
          if (result) {
            swal("Poof!", "Your hangout has been successfully ended!", "success");
          } else {
            swal("Oops something went wrong!", error.error + "\n Try again", "error");
          }
        });

      }); //sweetAlert

  },
  'click .edit-hangout': function(e, hangout) {
    //console.log(hangout.data.topic);
    //pass in the right times like 03/09/2016 2:03 AM
    var start_time_reverted = moment(hangout.data.start).format('MM/DD/YYYY h:mm A');
    var hangoutDuration = hangout.data.duration

    //var end_time_reverted = moment(hangout.data.end).format('MM/DD/YYYY h:mm A');

    console.log(hangout.data._id + ' this is an edited hangout id');

    Session.set('hangoutId', hangout.data._id);
    // Session.set('hostId', hangout.data.user_id);
    // Session.set('hostUsername', hangout.data.creator);

    // var editor_content = hangout.data.description;
    // console.log(typeof hangout.data.description);
    // var parsed = $.parseHTML(editor_content);
    // console.log(parsed);
    // var content = parsed.text();
    // console.log(content);
    //console.log(editor_content.html());


    Modal.show('editHangoutModal', {hangout});
    $('#edit-hangout-modal #topic').val(hangout.data.topic);
    // $('#edit-hangout-modal #description').val(hangout.data.description);
    // templateInstance.editor.setContents(hangout.data.description);
    $('#edit-hangout-modal input[value=' + hangout.data.type + ']').prop("checked", true);
    $('#edit-hangout-modal #start-date-time').val(start_time_reverted);
    $('#edit-hangout-modal #end-date-time').val(hangoutDuration);
    //console.log(start_time_reverted);
    //console.log(end_time_reverted);

  },
  'click .delete-hangout': function(e, hangout) {

    const data = {
      hangoutId: this._id,
      hostId: this.host.id,
      hostUsername: this.host.name,
    }

    sweetAlert({
        type: 'warning',
        title: TAPi18n.__("delete_hangout_confirm"),
        text: TAPi18n.__("delete_hangout_text"),
        cancelButtonText: TAPi18n.__("no_delete_hangout"),
        confirmButtonText: TAPi18n.__("yes_delete_hangout"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: false,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();
        // if user confirmed/selected yes, let's call the delete hangout method on the server

        Meteor.call('deleteHangout', data, function(error, result) {
          if (result) {
            swal("Poof!", "Your hangout has been successfully deleted!", "success");
          } else {
            swal("Oops something went wrong!", error.error + "\n Try again", "error");
          }
        });
      }); //sweetAlert
  },

});
