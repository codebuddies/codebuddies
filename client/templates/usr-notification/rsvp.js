Template.registerHelper("isSingular", function(count){
  return count === 1 ? true : false;
});

Template.registerHelper("anyAttendees", function(count){
  return count > 0 ? true : false;
});

Template.rsvp.onCreated(function() {
    var instance = this;
    instance.flag = new ReactiveVar(false);
    instance.limit = new ReactiveVar(10);
    instance.autorun(function () {
      var limit = instance.limit.get();
      var subscription = instance.subscribe('attendees', limit);
    });

    instance.dispNotifications = function() {
      return RSVPnotifications.find({},{sort: {date: -1}});
    }
  });

  Template.rsvp.onRendered(function(){
    var instance = this;

       $('#flux').bind('scroll', function(){
           if($('#flux').scrollTop() + $('#flux').innerHeight()>=$('#flux')[0].scrollHeight){

             if(RSVPnotifications.find().count() === instance.limit.get()){
               instance.limit.set(instance.limit.get() + 5);
               $('body').addClass('stop-scrolling')
             }else {
               if(RSVPnotifications.find({},{sort: {date: -1}}).count() < instance.limit.get()){
                 instance.flag.set(true);
               }
             }

           }
       });
  });

Template.rsvp.helpers({
  notifications:function(){
    return Template.instance().dispNotifications();
  },
});

Template.rsvp.events({
  "click .markAsRead": function(event, template){
    Meteor.call('markItRead', this._id, function(error, result) { });
  }
});
