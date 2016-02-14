Template.statusItem.helpers({
  hangoutStatus: function() {
    if (this.statusHangout == 'silent')
      return "btn-danger";
    else if (this.statusHangout == 'teaching')
      return "btn-warning";
    else if (this.statusHangout == "collaboration")
      return "btn-success";
    else
      return "btn-success";
  },
  logged_in_using_codebuddies_team: function() {
    return Meteor.user().profile.team_id === "T04AQ6GEY";
  }
});  
