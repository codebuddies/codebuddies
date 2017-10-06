Template.studyGroupSettings.events({
  "click #archiveStudyGroup":function (event, template) {

    const studyGroupId = this._id;

    sweetAlert({
        type: 'warning',
        title: TAPi18n.__("delete_hangout_confirm"),
        text: TAPi18n.__("archive_final_warning"),
        cancelButtonText: TAPi18n.__("no_delete_group"),
        confirmButtonText: TAPi18n.__("yes_delete_group"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: true,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();
        // if user confirmed/selected yes, let's call the delete hangout method on the server


        Meteor.call("archiveStudyGroup", studyGroupId ,function (error, result) {
          if(error){
            return Bert.alert( error.reason, 'danger', 'growl-top-right' );
          }
          if(result){
            FlowRouter.go("all study groups");
            return Bert.alert( 'Study Group Archived', 'success', 'growl-top-right' );
          }
        })
      });
  },
  "change #hangoutPermission": function (event, template) {


      const data = {
        id: this._id,
        permission: template.find("#hangoutPermission").value == "true" ? true : false
      }


      sweetAlert({
        type: 'warning',
        title: TAPi18n.__("delete_hangout_confirm"),
        cancelButtonText: TAPi18n.__("no_delete_group"),
        confirmButtonText: TAPi18n.__("yes_delete_learning"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: true,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();

        Meteor.call("updateHangoutCreationPermission", data ,function (error, result) {
          if(error){
            return Bert.alert( error.reason, 'danger', 'growl-top-right' );
          }
          if(result){
            return Bert.alert( 'Permission updated', 'success', 'growl-top-right' );
          }
        })
      });
  }
});
