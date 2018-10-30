import QuillEditor from "../../libs/QuillEditor";

Template.hangoutActionButtons.helpers({
  icsDownloadLink: function(hangout) {
    const nowDate = new Date();
    const startDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(hangout.start);
    const startTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(hangout.start);
    const endDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(hangout.end);
    const endTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(hangout.end);
    const currentDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(nowDate);
    const currentTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(nowDate);
    const start = `${startDate}T${startTime}`;
    const end = `${endDate}T${endTime}`;
    const current = `${currentDate}T${currentTime}`;
    const SEPARATOR = navigator.appVersion.indexOf("Win") !== -1 ? "\r\n" : "\n";

    let topic = hangout.topic;
    const group = (hangout && hangout.group) || null;
    if (group && group.title) {
      topic += `(${group.title})`;
    }
    const location = `https://meet.jit.si/cb${hangout._id}`;
    const uid = `${Date.now()}@codebuddies.org`;
    const calendarDetails = [
      "BEGIN:VEVENT",
      `UID:${uid}`,
      "CLASS:PUBLIC",
      `DESCRIPTION:${hangout.description}`,
      `DTSTAMP;VALUE=DATE-TIME:${current}`,
      `DTSTART;VALUE=DATE-TIME:${start}`,
      `DTEND;VALUE=DATE-TIME:${end}`,
      `LOCATION:${location}`,
      `URL:${location}`,
      `SUMMARY;LANGUAGE=en-us:${topic}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    ].join(SEPARATOR);
    const calendarEvent = `BEGIN:VCALENDAR${SEPARATOR}PRODID:Calendar${SEPARATOR}VERSION:2.0${SEPARATOR}${calendarDetails}${SEPARATOR}END:VCALENDAR`;
    return `data:text/calendar;charset=utf8,${encodeURIComponent(calendarEvent)}`;
  },
  googleCalendarUrl: function(hangout) {
    const { _id: id, topic, description, group, start, end } = hangout;
    const startDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(start);
    const startTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(start);
    const endDate = Blaze._globalHelpers.getHangoutGoogleCalendarDate(end);
    const endTime = Blaze._globalHelpers.getHangoutGoogleCalendarTime(end);
    const groupTitle = group ? `(${group.title})` : "";
    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(
      topic
    )} ${groupTitle}&details=${encodeURIComponent(description)}`;
    const location = `https://meet.jit.si/cb${id}`;
    const dates = `${startDate}T${startTime}/${endDate}T${endTime}`;
    return `${calendarUrl}&location=${location}&dates=${dates}`;
  }
});

Template.hangoutActionButtons.events({
  "click .clone-hangout": function(e, hangout) {
    if (Meteor.userId()) {
      // console.log(hangout.data._id + ' this is a cloned hangout id');
      Session.set("hangoutId", hangout.data._id);
      Modal.show("cloneHangoutModal", { hangout });
      $("#clone-hangout-modal input#external-checkbox").prop("checked", hangout.data.externalCheckbox);
      $("#clone-hangout-modal #externalButtonText").val(hangout.data.externalButtonText);
      $("#clone-hangout-modal #externalURL").val(hangout.data.externalURL);
      $("#clone-hangout-modal #topic").val(hangout.data.topic);
      $("#clone-hangout-modal input[value=" + hangout.data.type + "]").prop("checked", true);
    }
  },
  "click .edit-hangout": function(e, hangout) {
    //console.log(hangout.data.topic);
    //pass in the right times like 03/09/2016 2:03 AM
    var start_time_reverted = moment(hangout.data.start).format("MM/DD/YYYY h:mm A");
    var hangoutDuration = hangout.data.duration;

    //var end_time_reverted = moment(hangout.data.end).format('MM/DD/YYYY h:mm A');

    console.log(hangout.data._id + " this is an edited hangout id");

    Session.set("hangoutId", hangout.data._id);
    // Session.set('hostId', hangout.data.user_id);
    // Session.set('hostUsername', hangout.data.creator);

    // var editor_content = hangout.data.description;
    // console.log(typeof hangout.data.description);
    // var parsed = $.parseHTML(editor_content);
    // console.log(parsed);
    // var content = parsed.text();
    // console.log(content);
    //console.log(editor_content.html());

    Modal.show("editHangoutModal", { hangout });
    $("#edit-hangout-modal #topic").val(hangout.data.topic);
    // $('#edit-hangout-modal #description').val(hangout.data.description);
    // templateInstance.editor.setContents(hangout.data.description);
    $("#edit-hangout-modal input[value=" + hangout.data.type + "]").prop("checked", true);
    $("#edit-hangout-modal input#external-checkbox").prop("checked", hangout.data.externalCheckbox);
    $("#edit-hangout-modal #externalButtonText").val(hangout.data.externalButtonText);
    $("#edit-hangout-modal #externalURL").val(hangout.data.externalURL);
    $("#edit-hangout-modal #start-date-time").val(start_time_reverted);
    $("#edit-hangout-modal #end-date-time").val(hangoutDuration);
    $("#edit-hangout-modal #group").val(hangout.data.group.title);
    //console.log(start_time_reverted);
    //console.log(end_time_reverted);
  },
  "click .delete-hangout": function(e, hangout) {
    const data = {
      hangoutId: this._id,
      hostId: this.host.id,
      hostUsername: this.host.name
    };

    swal({
      type: "warning",
      title: TAPi18n.__("delete_hangout_confirm"),
      text: TAPi18n.__("delete_hangout_text"),
      cancelButtonText: TAPi18n.__("no_delete_hangout"),
      confirmButtonText: TAPi18n.__("yes_delete_hangout"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true,
      closeOnConfirm: false
    }).then(result => {
      swal.disableButtons();

      if (result.value) {
        Meteor.call("deleteHangout", data, function(error) {
          swal("Poof!", "Your hangout has been successfully deleted!", "success");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        swal("Oops! Something went wrong", error.error, +"\n Try again", "error");
      }
    }); //sweetAlert
  },
  "click .create-hangout-popup": function() {
    Modal.show("createHangoutModal");
  },
  "click #end-hangout": function() {
    const data = {
      hangoutId: this._id
    };

    swal({
      type: "warning",
      title: TAPi18n.__("end_hangout_confirm"),
      cancelButtonText: TAPi18n.__("no_end_hangout"),
      confirmButtonText: TAPi18n.__("yes_end_hangout"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true,
      closeOnConfirm: false
    }).then(result => {
      swal.disableButtons();
      if (result.value) {
        Meteor.call("endHangout", data, function(error) {
          swal("Poof!", "Your hangout has been successfully deleted!", "success");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        swal("Oops! Something went wrong", error.error, +"\n Try again", "error");
      }
    }); //sweetAlert 2
  }
});
