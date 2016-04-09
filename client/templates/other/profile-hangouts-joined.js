Template.hangoutsJoined.onRendered(function() {
   var instance = this;
   $('#hangout-joined-pagination').bind('scroll', function(){
       if($('#hangout-joined-pagination').scrollTop() + $('#hangout-joined-pagination').innerHeight()>=$('#hangout-joined-pagination')[0].scrollHeight){
          console.log("message");

           if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 5);
           }else {
             if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
             }
           }
       }
   });
});
Template.hangoutsJoined.onCreated(function () {

  var instance = this;
  instance.limit = new ReactiveVar(4);
  instance.flag = new ReactiveVar(false);

  instance.autorun(function () {

    var limit = instance.limit.get();

    var subscription = instance.subscribe('hangoutsJoined', limit);
  });

   instance.hangoutsJoined = function() {
     if(Hangouts.find().count() <  instance.limit.get()){
       instance.flag.set(true);
     }
    return Hangouts.find({}, {sort: {timestamp: -1}});
  }

});

Template.hangoutsJoined.helpers({
  hangouts: function () {
    return Template.instance().hangoutsJoined();
  },

  hasMoreHangouts: function () {
    return Template.instance().flag.get();
  }
});

Template.hangoutsJoined.events({
  "click #go-to-top": function(event, template){
    var pos = document.getElementById("hangout-joined-pagination");
    pos.scrollTop = - pos.scrollHeight;
  }
});
