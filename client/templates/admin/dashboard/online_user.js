
Template.onlineUser.helpers({
  users:function(){
    return Meteor.users.find({ "status.online": true });
  }
});

Template.onlineUser.events({
  "click #foo": function(event, template){

  }
});
