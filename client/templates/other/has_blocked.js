"use strict"

import '../../../imports/ui/pages/users/basic_user_information';

Template.hasBlocked.helpers({
  target: function () {
    let loggedInUser = Meteor.user()
    if (Roles.userIsInRole(loggedInUser, 'inactive', 'CB')) {
      return 'suspended'
    } else {
      if (loggedInUser
        && loggedInUser.profile.hasOwnProperty('complete')
        && ! loggedInUser.profile.complete){

        return 'basicUserInformation'
      }
      return this.targetTemplate
    }
  }
})
