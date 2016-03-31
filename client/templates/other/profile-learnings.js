Template.profileLearnings.onRendered(function() {
   var instance = this;
   $('#learning-pagination').bind('scroll', function(){
       if($('#learning-pagination').scrollTop() + $('#learning-pagination').innerHeight()>=$('#learning-pagination')[0].scrollHeight){

           if(Learnings.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 5);
           }else {
             if(Learnings.find().count() < instance.limit.get()){
               instance.flag.set(true);
             }
           }
       }
   });
});



Template.profileLearnings.onCreated(function () {

  var instance = this;
  instance.limit = new ReactiveVar(6);
  instance.flag = new ReactiveVar(false);

  instance.autorun(function () {

    var limit = instance.limit.get();

    var subscription = instance.subscribe('ownLearnings', limit);

  });

   instance.ownLearnings = function() {
     if(Learnings.find().count() <  instance.limit.get()){
       instance.flag.set(true);
     }
    return Learnings.find({},{sort: {timestamp: -1}});
  }

});

Template.profileLearnings.helpers({

  learnings: function () {
    return Template.instance().ownLearnings();
  },

  hasMoreLearnings: function () {
    return Template.instance().flag.get();
  }
});

Template.profileLearnings.events({
  "click #go-to-top": function(event, template){
    var pos = document.getElementById("learning-pagination");
    pos.scrollTop = - pos.scrollHeight;
  }
});
