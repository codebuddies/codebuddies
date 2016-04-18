"use strict"

Template.isAdmin.helpers({
  target: function () {
    var loggedInUserId = Meteor.userId()
    console.log("user",loggedInUserId);

    if (!Roles.userIsInRole(loggedInUserId, ['admin'])) {
      return 'unauthorised'
    } else {
      return this.targetTemplate
    }
  }
})
