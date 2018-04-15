Template.homeLoggedOut.onCreated(function(){
  var title = "CodeBuddies | Home";
  var metaInfo = {name: "description", content: "We're a community learning code via a Slack chatroom, a Facebook Group, and peer-to-peer organized pair-programming hangouts. Learning with others helps us learn faster. The project is free, open-sourced, and 100% community-built."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});


Template.homeLoggedOut.events({
  'click .signIn': function(event) {
    var options = {
      requestPermissions: ['identity.basic', 'identity.email']
    };
    Meteor.loginWithSlack(options);
  }
});
