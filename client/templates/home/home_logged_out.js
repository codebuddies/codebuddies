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
  instance.autorun(function() {
    instance.subscribe("allStudyGroups", 0, "");
    instance.subscribe("allDiscussions", 0, "");
    instance.subscribe("learnings", 0);
    instance.subscribe("visibleHangouts");
  });

  instance.studyGroupCount = function() {
    return StudyGroups.find({}).count();
  };

  instance.discussionCount = function() {
    return Discussions.find({}).count();
  };

  instance.learningsCount = function() {
    return Learnings.find({}).count();
  };

  instance.hangoutsCount = function() {
    return Hangouts.find({}).count();
  };
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
    return Template.instance().studyGroupCount();
  },
  discussionCount: function() {
    return Template.instance().discussionCount();
  },
  learningsCount: function() {
    return Template.instance().learningsCount();
  },
  hangoutsCount: function() {
    return Template.instance().hangoutsCount();
  }
});
