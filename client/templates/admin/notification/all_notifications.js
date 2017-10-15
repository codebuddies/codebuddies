Template.registerHelper('dispDate', function(date) {
  return moment(date).format('h:mm a \ Do MMM \'YY');
});

Template.registerHelper("isActorAdmin", function(actorId){
  return Roles.userIsInRole( actorId, ['admin'], 'CB') ;
});

Template.registerHelper('dispCustomDate', function(date, format) {
  return moment(date).format(format);
});

Template.allNotification.onCreated(function() {
    var instance = this;
    instance.flag = new ReactiveVar(false);
    instance.limit = new ReactiveVar(10);
    instance.autorun(function () {
      var limit = instance.limit.get();
      var subscription = instance.subscribe('allNotifications', limit);
    });

    instance.dispNotifications = function() {
      return Notifications.find({},{sort: {createdAt: -1}});
    }
  });

  Template.allNotification.onRendered(function(){
    var instance = this;

       $('#flux').bind('scroll', function(){
           if($('#flux').scrollTop() + $('#flux').innerHeight()>=$('#flux')[0].scrollHeight){

             if(Notifications.find().count() === instance.limit.get()){
               instance.limit.set(instance.limit.get() + 5);
               $('body').addClass('stop-scrolling')
             }else {
               if(Notifications.find().count() < instance.limit.get()){
                 instance.flag.set(true);
               }
             }

           }
       });
  });


Template.allNotification.helpers({
  notifications:function(){
    return Template.instance().dispNotifications();
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
