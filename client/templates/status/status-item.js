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
  }
});
