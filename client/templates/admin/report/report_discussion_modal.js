Template.reportDiscussionModal.events({
  "click #report-hangout": function(event, template) {
    const data = {
      discussionId: template.data._id,
      discussionTopic: template.data.topic,
      category: $('input[name="report-category"]:checked').val(),
      reporterId: Meteor.userId()
    };

    Meteor.call("discussions.report", data, function(err, result) {
      if (result) {
        Modal.hide();
        swal({
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
