Template.homeLoggedOut.onCreated(function() {
  var title = "CodeBuddies | Home";
  var metaInfo = {
    name: "description",
    content:
      "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized pair-programming hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built."
  };
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  let instance = this;
  instance.data.studyGroupCount = new ReactiveVar(0);
  instance.data.discussionCount = new ReactiveVar(0);
  instance.data.learningsCount = new ReactiveVar(0);
  instance.data.hangoutsCount = new ReactiveVar(0);
  Meteor.call("getOverallStats", null, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      const {
        studyGroupCount = 0,
        discussionCount = 0,
        learningsCount = 0,
        hangoutsCount = 0
      } =
        result || {};
      instance.data.studyGroupCount.set(studyGroupCount);
      instance.data.discussionCount.set(discussionCount);
      instance.data.learningsCount.set(learningsCount);
      instance.data.hangoutsCount.set(hangoutsCount);
    }
  });
});

Template.homeLoggedOut.events({
  "click .signIn": function(event) {
    var options = {
      requestPermissions: ["identity.basic", "identity.email"]
    };
    Meteor.loginWithSlack(options);
  },
  "click .signInGithub": function(event) {
    var options = {
      requestPermissions: ["read:user", "user:email"]
    };
    Meteor.loginWithGithub(options);
  }
});
