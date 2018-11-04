Template.editResponseModal.onCreated(function() {
  const instance = this;
  instance.processing = new ReactiveVar(false);
  instance.discussionResponsePreview = new ReactiveVar("");
});

Template.editResponseModal.onRendered(function() {
  const instance = this;
  instance.discussionResponsePreview.set(instance.data.text);
});

Template.editResponseModal.helpers({
  processing: function() {
    return Template.instance().processing.get();
  },
  discussionResponsePreview: function() {
    console.log(Template.instance().discussionResponsePreview.get());

    return Template.instance().discussionResponsePreview.get();
  }
});

Template.editResponseModal.events({
  "change #editDiscussionResponse": function(event, template) {
    event.preventDefault();
    template.discussionResponsePreview.set($.trim(template.find("#editDiscussionResponse").value));
  },
  "submit .editDiscussion": function(event, template) {
    event.preventDefault();

    $(".form-control").css({ border: "1px solid #cccccc" });

    if ($.trim(template.find("#editDiscussionResponse").value) == "") {
      $("#editDiscussionResponse").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Description", "warning", "growl-top-right");
    }

    // console.log(this);
    const data = {
      id: this._id,
      text: $.trim(template.find("#editDiscussionResponse").value)
    };

    // console.log(data);
    template.processing.set(true);

    Meteor.call("discussionResponses.update", data, function(error, result) {
      if (error) {
        template.processing.set(false);
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        template.processing.set(false);
        Bert.alert("Responses Updated!", "success", "growl-top-right");
        Modal.hide();
      }
    });
  }
});
