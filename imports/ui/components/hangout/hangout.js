import QuillEditor from "../../libs/QuillEditor";

Meteor.startup(function() {
  $("head").append('<link href="https://cdn.quilljs.com/1.0.3/quill.snow.css" rel="stylesheet">');
  //$('head').append('<script src="https://meet.jit.si/external_api.js"></script>');
});

Template.hangout.onCreated(function() {
  let instance = this;
  var title = "CodeBuddies | Hangout";
  DocHead.setTitle(title);

  instance.subscribe("hangoutById", FlowRouter.getParam("hangoutId"));
});

Template.hangout.helpers({
  formatDescription: ({ description_in_quill_delta, description }) => {
    if (description_in_quill_delta) {
      return QuillEditor.generateHTMLForDeltas(description_in_quill_delta);
    } else {
      return description;
    }
  },
  hangout: function() {
    return Hangouts.findOne({ _id: FlowRouter.getParam("hangoutId") });
  },
  encodedText: function(str) {
    return encodeURIComponent(str);
  }
});
Template.hangout.events({
  "click #hide-sidebar": function() {
    $(".hangout-sidebar").hide();
    $(".hangout-body")
      .removeClass("col-md-9")
      .addClass("col-md-10 col-md-offset-1");
    $("#show-sidebar").fadeIn();
  },
  "click #show-sidebar": function() {
    $(".hangout-sidebar").show();
    $(".hangout-body")
      .removeClass("col-md-10 col-md-offset-1")
      .addClass("col-md-9");
    $("#show-sidebar").hide();
  },
  "click .join-hangout": function() {
    const data = {
      hangoutId: this._id,
      hostId: this.host.id
    };

    Meteor.call("addUserToHangout", data, function(error, result) {
      if (result) {
        swal({
          title: TAPi18n.__("you_are_awesome"),
          text: TAPi18n.__("looking_forward_to_see_you"),
          confirmButtonText: TAPi18n.__("ok"),
          type: "info"
        });
      }
    });
  },
  "click #leave-hangout": function() {
    if (this.host.id == Meteor.userId()) {
      swal({
        title: TAPi18n.__("remove_owner_from_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "warning"
      });
    } else {
      const data = {
        hangoutId: this._id,
        hostId: this.host.id
      };

      Meteor.call("removeUserFromHangout", data, function(error, result) {
        if (result) console.log("removed");
      });
    }
  },
  "click #hangout-faq-popup": function() {
    Modal.show("hangoutFAQModal");
  }
});
