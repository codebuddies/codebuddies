Template.adminLayout.onCreated(function(){


});

Template.adminLayout.onCreated(function(){
  var title = "Admin area | CodeBuddies ";
  DocHead.setTitle(title);
  var user = Meteor.userId();
  var shopId = FlowRouter.getParam('vendorId');
  this.subscribe("allUsers");
  this.subscribe("allNotifications");

});
