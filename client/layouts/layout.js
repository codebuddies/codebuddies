Template.layout.events({
  "click .continue-popup": function(event, template) {
    event.preventDefault();
    if (!Meteor.userId()) {
      swal({
        imageUrl: "/images/slack-signin-example.jpg",
        imageSize: "140x120",
        title: TAPi18n.__("you_are_almost_there"),
        html: TAPi18n.__("continue_popup_text"),
        showCancelButton: true,
        confirmButtonText: TAPi18n.__("continue_with_slack"),
        cancelButtonText: TAPi18n.__("not_now")
      }).then((result, error) => {
        var options = {
          requestPermissions: ["identity.basic", "identity.email"]
        };

        if (result.value) {
          Meteor.loginWithSlack(options);
        } else if (
          result.dismiss === "cancel" ||
          result.dismiss === "esc" ||
          result.dismiss === "overlay"
        ) {
          swal("Okay", "Sign in with slack at anytime.", "info");
        } else {
          swal(
            "Oops! Something went wrong",
            error.error,
            +"\n Try again",
            "error"
          );
        }
      });
    }
  }
});
