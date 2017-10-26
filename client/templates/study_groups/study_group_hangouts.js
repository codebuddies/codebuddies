Template.studyGroupHangouts.onCreated(function() {
   let instance = this;
   instance.limit = new ReactiveVar(20);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     let limit = instance.limit.get();
     let studyGroupId = FlowRouter.getParam('studyGroupId');
     instance.subscribe('studyGroupHangouts', studyGroupId, limit);
   });

   instance.loadHangouts = function() {
     return Hangouts.find({}, {sort: {start: -1}});
   }

   const now = new Date();

   instance.pastHangoutCount = function() {
     return Hangouts.find({'end': {$lt : now}}).count() || 0;
   }

   instance.liveHangoutCount = function() {
     return Hangouts.find({'end': {$gte : now}}).count() || 0;
   }
});

Template.studyGroupHangouts.onRendered(function() {
    let instance = this;

    instance.scrollHandler = function(){

      if  ($(window).scrollTop() > ($(document).height() - $(window).height()) -20 && !instance.flag.get()){

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 9);
             $('body').addClass('stop-scrolling');
        }else{
           if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }else {

           }
        }

      }

    }.bind(instance);
    $(window).on("scroll" ,instance.scrollHandler);

});



Template.studyGroupHangouts.helpers({
  hangouts:function(){
    return Template.instance().loadHangouts();
  },
  status:function(){
    return  Template.instance().flag.get();
  },
  hangoutCount: function() {
    return Template.instance().loadHangouts().count();
  },
  liveHangoutCount:function(){
    return Template.instance().liveHangoutCount();
  },
  pastHangoutCount:function(){
    return Template.instance().pastHangoutCount();
  }
});

Template.studyGroupHangouts.events({
  "click #newHangout": function(event) {
    Modal.show('createHangoutModal');
  },
});


Template.studyGroupHangouts.onDestroyed(function(){
    $(window).off("scroll", this.scrollHandler);
});
