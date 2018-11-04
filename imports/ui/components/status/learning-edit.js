Template.editLearningModal.events({
  "click #update-learning": function() {
    var title = $("#title").val();
    var learningId = Session.get("learningId");
    var data = {
      title: title,
      learningId: learningId
    };
    Meteor.call("editLearning", data, function(err, result) {
      if (result) {
        Modal.hide();
        swal({
          title: TAPi18n.__("hangout_edited_title"),
          text: TAPi18n.__("hangout_created_message"),
          confirmButtonText: TAPi18n.__("ok"),
          type: "success",
          closeOnConfirm: true
        });
      }
    });
    Modal.hide();
  }
});
