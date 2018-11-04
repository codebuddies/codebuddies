Template.hangoutItem.rendered = function() {
  //$('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');
};

Template.registerHelper("hangoutOwner", function(ownerid) {
  if (Meteor.userId() === ownerid) {
    return true;
  } else {
    return false;
  }
});

Template.hangoutItem.helpers({
  getDescriptionTruncated: function(description) {
    if (description.length > 201) {
      return description.substring(0, 201) + "...";
    } else {
      return description.substring(0, 201);
    }
  }
});

Template.hangoutItem.events({
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
