Template.hangoutList.onCreated(function() {
   var instance = this;
   instance.limit = new ReactiveVar(20);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     var limit = instance.limit.get();
     instance.subscribe('hangouts', limit);
   });

    instance.loadHangouts = function() {
      var now = new Date();
      return Hangouts.find({'end': { $gte : now }}, {sort: { start: 1 }});
    }

    instance.loadCompletedHangouts = function() {
      var now = new Date();
      return Hangouts.find({'end': {$lt : now}}, {sort: { start: -1 }});
    }

    instance.addMoreHangouts = function () {

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 9);

        } else {
            if (Hangouts.find().count() < instance.limit.get()) {
                instance.flag.set(true);
            }
        }
    }
});



Template.hangoutList.helpers({
  hangouts:function(){
    return Template.instance().loadHangouts();
  },
  completedHangouts:function(){
    return Template.instance().loadCompletedHangouts();
  },
  status:function(){
     return  Template.instance().flag.get();
  }
});

Template.hangoutList.events({
    "click #loadMore": function (event, template) {
        template.addMoreHangouts();
    }
});
