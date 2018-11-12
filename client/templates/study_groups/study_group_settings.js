import slack_channels from "/imports/data/slack_channels.js";

Template.studyGroupSettings.onRendered(function() {
  let instance = this;
  instance.$("#studyGroupMemberList").prop("disabled", true);
  instance.$("#transferOwnership").prop("disabled", true);
  const members = instance.data.members;
  if (members.length > 1) {
    const eligibleMembers = members.filter(member => member.role !== `owner`).map(member => {
      return { id: member.id, text: member.name };
    });

    instance.$("#studyGroupMemberList").prop("disabled", false);
    instance.$("#transferOwnership").prop("disabled", false);
    Meteor.setTimeout(function() {
      instance.$("#studyGroupMemberList", eligibleMembers).select2({
        placeholder: TAPi18n.__("select_new_owner"),
        data: eligibleMembers
      });
    }, 1500);
  }

  /* populate slack channel dropdown */
  const channelArray = slack_channels.map(c => ({ id: c, text: c }));
  instance.$("#hangoutChannelList", channelArray).select2({
    placeholder: TAPi18n.__("select_channel"),
    data: channelArray,
    allowClear: true,
    maximumSelectionLength: 3,
    tokenSeparators: [","]
  });

  /* display selected channels */
  instance.$("#hangoutChannelList").val(instance.data.hangoutChannels);
  instance.$("#hangoutChannelList").trigger("change");
});

Template.studyGroupSettings.events({
  "click #archiveStudyGroup": function(event, template) {
    const studyGroupId = this._id;

    swal({
      type: "warning",
      text: TAPi18n.__("archive_final_warning"),
      cancelButtonText: TAPi18n.__("no_delete_group"),
      confirmButtonText: TAPi18n.__("yes_delete_group"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true
    }).then(result => {
      swal.disableButtons();

      if (result.value) {
        Meteor.call("archiveStudyGroup", studyGroupId, function(error) {
          FlowRouter.go("all study groups");
          swal("Poof!", "Your study group has been archived", "success");
          return Bert.alert("Study Group Archived", "success", "growl-top-right");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  },
  "change #hangoutPermission": function(event, template) {
    const data = {
      id: this._id,
      permission: template.find("#hangoutPermission").value == "true" ? true : false
    };

    swal({
      type: "warning",
      text: TAPi18n.__("delete_hangout_confirm"),
      cancelButtonText: TAPi18n.__("no_delete_group"),
      confirmButtonText: TAPi18n.__("yes_delete_learning"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true
    }).then(result => {
      swal.disableButtons();

      if (result.value) {
        Meteor.call("updateHangoutCreationPermission", data, function(error) {
          swal("Yay!", "Permissions have been successfully updated", "success");
          return Bert.alert("Permission updated", "success", "growl-top-right");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  },
  "click #transferOwnership": function(event, template) {
    const data = {
      studyGroupId: this._id,
      newOwnerId: template.find("#studyGroupMemberList").value
    };
    const newOwnerUsername = template.find("#studyGroupMemberList option:selected").text;

    swal({
      type: "warning",
      text: TAPi18n.__("transfer_study_group"),
      cancelButtonText: TAPi18n.__("no_transfer_group"),
      confirmButtonText: TAPi18n.__("yes_transfer_group"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true
    }).then(result => {
      swal.disableButtons();

      if (result.value) {
        Meteor.call("transferStudyGroupOwnership", data, function(error) {
          $('div.study-group-body [role="presentation"] a:first').tab("show");
          swal("Poof!", "Your Study Group has been transferred", "success");
          return Bert.alert(`Study Group transferred to ${newOwnerUsername}`, "success", "growl-top-right");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  },
  "click #hangoutChannel": function(event, template) {
    const data = {
      studyGroupId: this._id,
      hangoutChannels: $("#hangoutChannelList").val() || []
    };
    swal({
      type: "warning",
      text: TAPi18n.__("delete_hangout_confirm"),
      cancelButtonText: TAPi18n.__("no_delete_group"),
      confirmButtonText: TAPi18n.__("yes_delete_learning"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true
    }).then(result => {
      swal.disableButtons();

      if (result.value) {
        Meteor.call("saveHangoutChannel", data, function(error) {
          return Bert.alert(`Hangout channels saved`, "success", "growl-top-right");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  }
});
