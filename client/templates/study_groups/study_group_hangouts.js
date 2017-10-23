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
      const now = new Date();
      return Hangouts.find({'end': { $gte : now }}, {sort: { start: 1 }});
   }

   instance.loadCompletedHangouts = function() {
     const now = new Date();
     return Hangouts.find({'end': {$lt : now}}, {sort: { start: -1 }});
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
  completedHangouts:function(){
    return Template.instance().loadCompletedHangouts();
  },
  status:function(){
    return  Template.instance().flag.get();
  },
  noHangout: function() {
    return Template.instance().loadHangouts().count() === 0 &&
      Template.instance().loadCompletedHangouts().count() === 0;
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
