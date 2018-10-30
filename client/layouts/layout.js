Template.layout.events({
  "click .continue-popup": function(event, template) {
    event.preventDefault();
    if (!Meteor.userId()) {
      swal({
        title: TAPi18n.__("you_are_almost_there"),
        html: TAPi18n.__("signup_or_signin"),
        showCancelButton: true,
        showConfirmButton: true,
        showCloseButton: true,
        confirmButtonText: "Slack",
        cancelButtonText: "Github",
        confirmButtonColor: "#3AAF85",
        cancelButtonColor: "#333"
      }).then((result, error) => {
        var slackOptions = {
          requestPermissions: ["identity.basic", "identity.email"]
        };
        var githubOptions = {
          requestPermissions: ["read:user", "user:email"]
        };
        if (result.value) {
          Meteor.loginWithSlack(slackOptions);
        } else if (result.dismiss === "cancel") {
          Meteor.loginWithGithub(githubOptions, function(err) {
            if (!err) {
              FlowRouter.go("hangouts");
            }
          });
        } else if (result.dismiss === "esc" || result.dismiss === "overlay") {
          swal("No worries!", "Sign up or sign in with Slack or Github at any time.", "info");
        } else {
          swal("Oops! Something went wrong", error.error, +"\n Try again", "error");
        }
      });
    }
  },
  "click .signInGithub": function(event) {}
});
