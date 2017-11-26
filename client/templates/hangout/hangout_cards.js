Template.hangoutCards.onCreated(function() {
  var instance = this;
   instance.limit = new ReactiveVar(12);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     var limit = instance.limit.get();
     instance.subscribe('hangouts', limit);
   });

    var instance = this;

    instance.loadHangouts = function(flag = 1) {
      return Hangouts.find({}, {sort: {start: flag}});
    }

    const now = new Date();
    instance.liveHangoutsCount = function() {
        return Hangouts.find({'end': { $gte : now }}).count() || 0;
    }

    instance.pastHangoutsCount = function() {
        return Hangouts.find({'end': { $lt : now }}).count() || 0;
    }

    instance.addMoreHangouts = function(){

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 9);

        }else{
           if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }
       }
    }

});

Template.hangoutCards.helpers({
  hangouts:function(flag){
    return Template.instance().loadHangouts(flag);
  },
  status:function(){
     return  Template.instance().flag.get();
  },
  liveHangoutsCount: function() {
      return Template.instance().liveHangoutsCount();
  },
  pastHangoutsCount: function() {
      return Template.instance().pastHangoutsCount();
  }
});

Template.hangoutCards.events({
  "click #loadMore": function(event, template){
     template.addMoreHangouts();
  }
});
