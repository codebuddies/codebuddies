import QuillEditor from "../../libs/QuillEditor";

Template.hangoutActionBar.events({
  "click .report-hangout": function(e, hangout) {
    if (Meteor.userId()) {
      const hangoutId = hangout.data._id;
      Session.set("hangoutId", hangoutId);

      Modal.show("reportHangoutModal");
    }
  },
  "click .clone-hangout": function(e, hangout) {
    if (Meteor.userId()) {
      // console.log(hangout.data._id + ' this is a cloned hangout id');
      Session.set("hangoutId", hangout.data._id);
      Modal.show("cloneHangoutModal", { hangout });
      $("#clone-hangout-modal input#external-checkbox").prop(
        "checked",
        hangout.data.externalCheckbox
      );
      $("#clone-hangout-modal #externalButtonText").val(
        hangout.data.externalButtonText
      );
      $("#clone-hangout-modal #externalURL").val(hangout.data.externalURL);
      $("#clone-hangout-modal #topic").val(hangout.data.topic);
      $("#clone-hangout-modal input[value=" + hangout.data.type + "]").prop(
        "checked",
        true
      );
    }
  },
  "click .edit-hangout": function(e, hangout) {
    //console.log(hangout.data.topic);
    //pass in the right times like 03/09/2016 2:03 AM
    var start_time_reverted = moment(hangout.data.start).format(
      "MM/DD/YYYY h:mm A"
    );
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
    $("#edit-hangout-modal input#external-checkbox").prop(
      "checked",
      hangout.data.externalCheckbox
    );
    $("#edit-hangout-modal #externalButtonText").val(
      hangout.data.externalButtonText
    );
    $("#edit-hangout-modal #externalURL").val(hangout.data.externalURL);
    $("#edit-hangout-modal #topic").val(hangout.data.topic);
    // $('#edit-hangout-modal #description').val(hangout.data.description);
    // templateInstance.editor.setContents(hangout.data.description);
    $("#edit-hangout-modal input[value=" + hangout.data.type + "]").prop(
      "checked",
      true
    );
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
          swal(
            "Poof!",
            "Your hangout has been successfully deleted!",
            "success"
          );
        });
      } else if (
        result.dismiss === "cancel" ||
        result.dismiss === "esc" ||
        result.dismiss === "overlay"
      ) {
        swal("Phew!", "No changes made", "info");
      } else {
        swal(
          "Oops! Something went wrong",
          error.error,
          +"\n Try again",
          "error"
        );
      }
    }); //sweetAlert 2
  }
});
