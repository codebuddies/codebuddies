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
  instance.studyGroupCount = new ReactiveVar(0);
  instance.discussionCount = new ReactiveVar(0);
  instance.learningsCount = new ReactiveVar(0);
  instance.hangoutsCount = new ReactiveVar(0);
  Meteor.call("getOverallStats", null, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      const {
        studyGroupCount = 0,
        discussionCount = 0,
        learningsCount = 0,
        hangoutsCount = 0
      } =
        result || {};
      instance.studyGroupCount.set(studyGroupCount);
      instance.discussionCount.set(discussionCount);
      instance.learningsCount.set(learningsCount);
      instance.hangoutsCount.set(hangoutsCount);
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

Template.homeLoggedOut.helpers({
  studyGroupCount: function() {
    return Template.instance().studyGroupCount.get();
  },
  discussionCount: function() {
    return Template.instance().discussionCount.get();
  },
  learningsCount: function() {
    return Template.instance().learningsCount.get();
  },
  hangoutsCount: function() {
    return Template.instance().hangoutsCount.get();
  }
});
