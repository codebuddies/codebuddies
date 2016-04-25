"use strict"

Template.hasBlocked.helpers({
  target: function () {
    var loggedInUserId = Meteor.userId()
    if (Roles.userIsInRole(loggedInUserId, 'inactive')) {
      return 'suspended'
    } else {
      return this.targetTemplate
    }
  }
})
