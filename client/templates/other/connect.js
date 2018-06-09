Template.connect.onCreated(function() {
  var title = "CodeBuddies | Connect";
  var metaInfo = {
    name: "description",
    content:
      "Our community spends a lot of time helping each other on Slack, but it's hard to schedule study times in advance in a chatroom, and it's also hard to know who else is online possibly working on the same thing at the same time. This website solves those issues."
  };
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.connect.onRendered(function() {});

Template.connect.events({
  'click label[for="partner"]': function() {
    $("section#partner").fadeIn();
  }
});
