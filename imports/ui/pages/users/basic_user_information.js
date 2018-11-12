import "./basic_user_information.html";
import { Template } from "meteor/templating";

Template.basicUserInformation.onCreated(function() {
  instance = this;
  instance.processing = new ReactiveVar(false);
});

Template.basicUserInformation.events({
  "click #saveAndContinue": function(event, template) {
    event.preventDefault();
    $(".form-control").css({ border: "1px solid #cccccc" });

    const usernameRegex = /^[a-zA-Z0-9]+$/;

    if ($.trim(template.find("#fName").value) == "") {
      $("#fName").css({ border: "#FF0000 1px solid" });
      return Bert.alert("First name can't be empty", "warning", "growl-top-right");
    }

    if ($.trim(template.find("#lName").value) == "") {
      $("#lName").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Last name can't be empty", "warning", "growl-top-right");
    }
    // Validating the intro
    if ($.trim(template.find("#bio").value) == "") {
      $("#bio").css({ border: "#FF0000 1px solid" });
      return Bert.alert("One line biography of yourself can't be empty", "warning", "growl-top-right");
    }

    // Validating the skills can you help others with
    if ($.trim(template.find("#skillsHelpOthers").value) == "") {
      $("#skillsHelpOthers").css({ border: "#FF0000 1px solid" });
      return Bert.alert("What skill(s) can you help others with can't be empty", "warning", "growl-top-right");
    }

    // Validating the skills are you trying to improve
    if ($.trim(template.find("#skillsImprove").value) == "") {
      $("#skillsImprove").css({ border: "#FF0000 1px solid" });
      return Bert.alert("What skill(s) are you trying to improve can't be empty", "warning", "growl-top-right");
    }

    if ($.trim(template.find("#username").value) == "") {
      $("#username").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Username can't be empty", "warning", "growl-top-right");
    }
    if (template.find("#username").value.match(usernameRegex) == null) {
      $("#username").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Username should only contains alphanumeric characters.", "warning", "growl-top-right");
    }
    if ($("#username").val().length > 22) {
      $("#username").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Please shorten your username.", "warning", "growl-top-right");
    }
    if ($("#username").val().length < 4) {
      $("#username").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Username must be at least 4 characters.", "warning", "growl-top-right");
    }

    const data = {
      firstname: $.trim(template.find("#fName").value),
      lastname: $.trim(template.find("#lName").value),
      username: $.trim(template.find("#username").value).toLowerCase(),
      bio: $.trim(template.find("#bio").value).toLowerCase(),
      skillsHelpOthersWith: $.trim(template.find("#skillsHelpOthers").value).toLowerCase(),
      skillsWantToImprove: $.trim(template.find("#skillsImprove").value).toLowerCase()
    };

    Meteor.call("updateBasicInformation", data, function(error, result) {
      if (error) {
        template.processing.set(false);
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        template.processing.set(false);
        Bert.alert({
          type: "success",
          message: "Welcome to CodeBuddies",
          icon: "fa-check-circle",
          hideDelay: 6500
        });
        FlowRouter.go("/welcome");
      }
    });
  }
});
