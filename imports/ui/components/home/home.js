import "./home.html";
Template.home.onCreated(function() {
  var title = "CodeBuddies | Home";
  var metaInfo = {
    name: "description",
    content:
      "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized screensharing/pair-programming hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built."
  };
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});
