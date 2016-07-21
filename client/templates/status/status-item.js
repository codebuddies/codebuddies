Template.statusItem.helpers({
  hangoutStatus: function() {
    if (this.statusHangout == 'silent')
      return "fa-microphone-slash";
    else if (this.statusHangout == 'teaching')
      return "fa-user";
    else if (this.statusHangout == "collaboration")
      return "fa-users";
    else
      return "fa-microphone-slash";
  },
  logged_in_using_codebuddies_team: function() {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
      return Meteor.user().profile.team_id === Meteor.settings.team_id;
    }
  }
});
