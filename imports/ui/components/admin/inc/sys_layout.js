Template.sysLayout.onCreated(function() {
  var title = "administrative area | CodeBuddies ";
  DocHead.setTitle(title);
  var user = Meteor.userId();
  this.subscribe("allUsers");
  this.subscribe("archivedUsers");
});
