Template.registerHelper("currentRole", function(){
  return FlowRouter.getParam('role');
});
Template.usersByRole.helpers({
  users:function(){
    return Meteor.users.find({roles:FlowRouter.getParam('role')});
  }
});

Template.usersByRole.events({
  "click #foo": function(event, template){

  }
});
