Template.hangoutsCreated.onRendered(function() {
   var instance = this;
   $('#hangout-created-pagination').bind('scroll', function(){
       if($('#hangout-created-pagination').scrollTop() + $('#hangout-created-pagination').innerHeight()>=$('#hangout-created-pagination')[0].scrollHeight){

           if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 5);
             instance.flag.set(false);
           }else {
             if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
             }
           }
       }
   });
});
Template.hangoutsCreated.onCreated(function () {

  var instance = this;

  instance.limit = new ReactiveVar(3);
  instance.flag = new ReactiveVar(false);

  instance.autorun(function () {

    var limit = instance.limit.get();

    var subscription = instance.subscribe('hangoutsCreated', limit);

  });

   instance.hangoutsCreated = function() {
     if(Hangouts.find().count() <  instance.limit.get()){
       instance.flag.set(true);
     }
    return Hangouts.find({}, {sort: {timestamp: -1}});
  }

});

Template.hangoutsCreated.helpers({

  hangouts: function () {
    return Template.instance().hangoutsCreated();
  },

  hasMoreHangouts: function () {
    return Template.instance().flag.get();
  }
});

Template.hangoutsCreated.events({
  "click #go-to-top": function(event, template){
    var pos = document.getElementById("hangout-created-pagination");
    pos.scrollTop = - pos.scrollHeight;
  }
});
