"use strict";

Template.hasPermission.helpers({
  target: function() {
    var loggedInUserId = Meteor.userId();

    if (!Roles.userIsInRole(loggedInUserId, ["admin", "moderator"], "CB")) {
      return "unauthorised";
    } else {
      return this.targetTemplate;
    }
  }
});
