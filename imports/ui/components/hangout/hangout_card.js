Template.hangoutCard.onRendered(function() {
  $(function() {
    $('[data-toggle="popover"]').popover({ trigger: "hover", html: "true" });
  });
});
Template.hangoutCard.helpers({
  truncate: function(topic) {
    return topic.truncate();
  },
  getDescriptionTruncated: function(description) {
    if (description.length && description.length > 400) {
      return description.substring(0, 400) + "...";
    } else {
      return description.substring(0, 400);
    }
  }
});

Template.hangoutCard.events({
  "click .join-hangout": function() {
    console.log("clicked on join hangout");
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
  }
});
