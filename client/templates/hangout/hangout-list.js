Template.hangoutList.onCreated(function() {
  var instance = this;
   instance.limit = new ReactiveVar(5);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     var limit = instance.limit.get();
     instance.subscribe('hangouts', limit);
   });

});


Template.hangoutList.onRendered(function() {
    var instance = this;

    instance.loadHangouts = function() {

      return Hangouts.find();
    }

    instance.addMoreHangouts = function(){
        console.log("loadmore called");

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 5);

        }else{
           if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }
       }
    }

});

Template.hangoutList.helpers({
  hangouts:function(){
    return Template.instance().loadHangouts();
  },
  status:function(){
     return  Template.instance().flag.get();
  }
});

Template.hangoutList.events({
  "click #loadMore": function(event, template){
     template.addMoreHangouts();
  }
});
