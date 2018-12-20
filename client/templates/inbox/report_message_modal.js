Template.report_message_modal.events({
  "click #report-message": function(event, template) {
    const data = {
      messageId: this._id,
      category: $('input[name="report-category"]:checked').val()
    };
    Meteor.call("messages.report", data, function(error, result) {
      if (result) {
        Modal.hide();
        sweetAlert({
          title: TAPi18n.__("discussion_has_been_reported"),
          text: TAPi18n.__("discussion_reported_message"),
          confirmButtonText: TAPi18n.__("ok"),
          type: "success",
          closeOnConfirm: true
        });
      }
    });
  }
});
