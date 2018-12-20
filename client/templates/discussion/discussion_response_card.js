Template.discussionResponseCard.events({
  "click #editResponse": function(event, template) {
    event.preventDefault();
    Modal.show("editResponseModal", this);
  },
  "click #deleteDiscussionResponse": function(event) {
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
    }).then(function(result) {
      swal.disableButtons();
      if (result.value) {
        Meteor.call("discussionResponses.remove", data, function(error) {
          swal("Poof!", "Your Discussion has been successfully deleted!", "success");
        });
      } else if (result.dismiss === "cancel" || result.dismiss === "esc" || result.dismiss === "overlay") {
        swal("Phew!", "No changes made", "info");
      } else {
        swal("Oops! Something went wrong", error.error, +"\n Try again", "error");
      }
    });
  },
  "click .rupvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    };
    Meteor.call("discussionResponses.upvote", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Bert.alert("Voted", "success", "growl-top-right");
      }
    });
  },
  "click .rdownvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    };

    Meteor.call("discussionResponses.downvote", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Bert.alert("Voted", "success", "growl-top-right");
      }
    });
  }
});
