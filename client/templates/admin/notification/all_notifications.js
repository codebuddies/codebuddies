Template.registerHelper('dispDate', function(date) {
  return moment(date).format('LT');
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
