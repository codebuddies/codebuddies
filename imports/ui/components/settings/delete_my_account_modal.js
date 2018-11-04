Template.deleteMyAccountModal.events({
  "click #delete": function(event, template) {
    event.preventDefault();
    //console.log(template.find('input:radio[name="reasonForDeletingAccount"]:checked').value);
    if (template.find('input:radio[name="reasonForDeletingAccount"]:checked') === null) {
      swal({
        title: TAPi18n.__("Please select your reason for leaving"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "warning"
      });
      return;
    }
    const reason = template.find('input:radio[name="reasonForDeletingAccount"]:checked').value;
    const detail = template.find("#detail").value;

    if ($.trim(reason) == "other" && $.trim(detail) == "") {
      swal({
        title: TAPi18n.__("Please specify your reason for leaving"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "warning"
      });
      return;
    }

    const data = {
      reason: reason,
      detail: detail || "Not Specified"
    };

    Meteor.call("deleteUserAccount", data, function(error, result) {
      if (error) {
        console.log("error", error.error);
      }
      if (result) {
        Modal.hide();
        FlowRouter.go("/goodbye");
      }
    });
  }
});
