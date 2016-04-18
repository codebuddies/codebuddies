Template.adminLayout.onCreated(function(){
  var title = "Admin area | CodeBuddies ";
  DocHead.setTitle(title);
  var user = Meteor.userId();
  this.subscribe("allUsers");

});
