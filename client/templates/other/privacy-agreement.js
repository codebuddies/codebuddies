Template.privacyAgreement.events({
  "click #privacyAgreement": function(event) {
    var isChecked = $('[name="privacy"]').is(":checked");
    Meteor.call("setPrivacyResponse", isChecked, function(error, result) {
      if (result) {
        return Bert.alert("Thank you!", "success", "growl-top-right");
      }
    });
  }
});
