import QuillEditor from '../../libs/QuillEditor';

Template.hangoutActionButtons.events({
  'click .clone-hangout': function(e, hangout) {

    if (Meteor.userId()) {
      // console.log(hangout.data._id + ' this is a cloned hangout id');
      Session.set('hangoutId', hangout.data._id);
      Modal.show('cloneHangoutModal', {hangout});
      $('#clone-hangout-modal #topic').val(hangout.data.topic);
      $('#clone-hangout-modal input[value=' + hangout.data.type + ']').prop("checked", true);
    }

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
    $('#edit-hangout-modal #group').val(hangout.data.group.title);
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
  'click #add-to-icalendar': function(e, hangout) {
    console.log(hangout);
    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
      sweetAlert({
          type: 'warning',
          title: 'Unsupported Browser',
          confirmButtonText: 'OK',
          confirmButtonColor: "#d9534f",
          showCancelButton: false,
          closeOnConfirm: false,
      });
      return;
    } else {
      const startDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(hangout.data.start)
      const startTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(hangout.data.start);
      const endDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(hangout.data.end)
      const endTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(hangout.data.end);

      const date = new Date();
      const currentDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(date)
      const currentTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(date);
      const start = `${startDate}T${startTime}`;
      const end = `${endDate}T${endTime}`;
      const current = `${currentDate}T${currentTime}`;
      const SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';

      let topic = hangout.data.topic;
      const group = (hangout && hangout.data && hangout.data.group) || null
      if (group.title) {
        topic += `(${group.title})`;
      }
      const location = `https://meet.jit.si/cb${hangout.data._id}`;
      const uid = `${Date.now()}@codebuddies.org`;
      const calendarDetails = [
         'BEGIN:VEVENT',
         `UID:${uid}`,
         'CLASS:PUBLIC',
         `DESCRIPTION:${hangout.data.description}`,
         `DTSTAMP;VALUE=DATE-TIME:${current}`,
         `DTSTART;VALUE=DATE-TIME:${start}`,
         `DTEND;VALUE=DATE-TIME:${end}`,
         `LOCATION:${location}`,
         `SUMMARY;LANGUAGE=en-us:${topic}`,
         'TRANSP:TRANSPARENT',
         'END:VEVENT'
      ].join(SEPARATOR);
      const calendarStart = `BEGIN:VCALENDAR${SEPARATOR}PRODID:Calendar${SEPARATOR}VERSION:2.0`;
      const calendarEnd = `END:VCALENDAR`;

      const calendarEvent  = `${calendarStart}${SEPARATOR}${calendarDetails}${SEPARATOR}${calendarEnd}`;
      console.log('calendarEvent', calendarEvent);
      window.open(`data:text/calendar;charset=utf8,${escape(calendarEvent)}`);
    }
  },
});
