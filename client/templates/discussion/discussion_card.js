Template.discussionCard.events({
  "click .edit-discussion": function(event, template) {
    event.preventDefault();
    Modal.show("editDiscussionModal", this);
  },
  "click .delete-discussion": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    };
    swal({
      type: "warning",
      title: "Are you sure?",
      cancelButtonText: TAPi18n.__("no_delete_hangout"),
      confirmButtonText: TAPi18n.__("yes_delete_hangout"),
      confirmButtonColor: "#d9534f",
      showCancelButton: true
    }).then(result => {
      swal.disableButtons();
      if (result.value) {
        Meteor.call("discussions.remove", data, function(error) {
          swal("Poof!", "Your Discussion has been successfully deleted!", "success");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        swal("Oops! Something went wrong", error.error, +"\n Try again", "error");
      }
    });
  },
  "click .upvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    };
    Meteor.call("discussions.upvote", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Bert.alert("Voted", "success", "growl-top-right");
      }
    });
  },
  "click .downvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    };

    Meteor.call("discussions.downvote", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Bert.alert("Voted", "success", "growl-top-right");
      }
    });
  },
  "click .select-tag": function(event, template) {
    event.preventDefault();
    const target = $(event.target);
    FlowRouter.go(`/discussions/?tags[]=${target.data("tag")}`);
  },
  "click .report-discussion": function(event) {
    event.preventDefault();
    Modal.show("reportDiscussionModal", this);
  }
});
