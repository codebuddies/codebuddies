Template.registerHelper('dispDate', function(date) {
  return moment(date).format('h:mm a \ Do MMM \'YY');
});

Template.registerHelper("isActorAdmin", function(actorId){
  return Roles.userIsInRole( actorId, ['admin']) ;
});

Template.allNotification.onCreated(function(){
  this.subscribe("allNotifications");
});

Template.allNotification.helpers({
  notifications:function(){
    //return Notifications.find();
    return Notifications.find({},{sort: {createdAt: -1}});
  },
  hasBeenSeen:function(){
    var userId = Meteor.userId();
    if (userId && !_.include(this.read, userId)) {
      return false;
    } else {
    return true;
    }
  }
});

Template.allNotification.events({
  "click .markAsRead": function(event, template){
    Meteor.call('markAsRead', this._id, function(error, result) { });
  }
});
