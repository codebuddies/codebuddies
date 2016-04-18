Template.registerHelper('dispDate', function(date) {
  return moment(date).format('LT');
});
Template.registerHelper("isActorAdmin", function(actorId){
  return Roles.userIsInRole(actorId, ['admin']);
});
Template.allNotification.onCreated(function(){
  this.subscribe("allNotifications");

});

Template.allNotification.helpers({
  notifications:function(){
    return Notifications.find();
  }
});

Template.allNotification.events({
  "click #foo": function(event, template){

  }
});
