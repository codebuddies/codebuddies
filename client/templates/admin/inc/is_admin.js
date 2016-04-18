"use strict"

Template.isAdmin.helpers({
  target: function () {
    var loggedInUserId = Meteor.userId()

    if (!Roles.userIsInRole(loggedInUserId, ['admin'])) {
      return 'unauthorised'
    } else {
      return this.targetTemplate
    }
  }
})
