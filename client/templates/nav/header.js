Template.header.onRendered(function() {
  this.subscribe("attendees", 10);
  this.subscribe("conversationsForCurrentUser");
});
Template.header.helpers({
  user: function() {
    return Meteor.user();
  },
  notificationCount: function() {
    return ReactiveMethod.call("notificationCount");
  },
  userNotificationCount: function() {
    return RSVPnotifications.find({ createorId: Meteor.userId(), seen: false }).count();
  },
  unreadConversationCount() {
    return Conversations.find({ "participants.id": Meteor.userId(), read_by: { $ne: Meteor.userId() } }).count();
    // const counter = Conversations.find(
    //   {"participants.id": Meteor.userId(), read_by: { $ne: Meteor.userId() }}
    // ).count()
    // console.log(counter);
  }
});

Template.header.events({
  "click .signInSlack": function(event) {
    var options = {
      requestPermissions: ["identity.basic", "identity.email"]
    };
    Meteor.loginWithSlack(options, function() {
      FlowRouter.go("hangouts");
    });
  },
  "click #signOut": function(event) {
    Meteor.logout(function(err) {
      FlowRouter.go("home");
    });
  },
  "click #newHangout": function(event) {
    Modal.show("createHangoutModal");
  },
  "click #newStudyGroup": function(event) {
    Modal.show("newStudyGroupModal");
  },
  "click #newDiscussion"(event, template) {
    const data = {
      _id: "CB",
      title: "CB",
      slug: "CB"
    };

    Modal.show("addDiscussionModal", data);
  },
  "click .signInGithub": function(event) {
    var options = {
      requestPermissions: ["read:user", "user:email"]
    };
    Meteor.loginWithGithub(options, function(err) {
      if (!err) {
        FlowRouter.go("hangouts");
      }
    });
  }
});
