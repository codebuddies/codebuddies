Template.hangoutBoard.onCreated(function() {
  var instance = this;
   instance.limit = new ReactiveVar(5);
   instance.flag = new ReactiveVar(false);
   instance.hangoutFilter = new ReactiveVar('live');



   instance.autorun(function () {
     var limit = instance.limit.get();
     var hangoutFilter = instance.hangoutFilter.get()
     instance.subscribe('hangoutBoard', limit, hangoutFilter);
   });

});

Template.hangoutBoard.onRendered(function() {
    var instance = this;

    instance.loadHangouts = function() {
      console.log('here');
      console.log(Hangouts.find().count());
      return Hangouts.find({}, {sort: {start: -1}});
    }

    instance.addMoreHangouts = function(){

        if(Hangouts.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 8);

        }else{
           if(Hangouts.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }
       }
    }

    var hangoutFilter = instance.hangoutFilter.get() || 'live';
    instance.hangoutFilter.set(hangoutFilter);

});

Template.hangoutBoard.helpers({
  hangouts:function(){
    console.log('here');
    return Template.instance().loadHangouts();
  },
  status:function(){
     return  Template.instance().flag.get();
  },
  hangoutFilter: function(){
    console.log(Template.instance().hangoutFilter.get());
    return Template.instance().hangoutFilter.get()
  }
});

Template.hangoutBoard.events({
  "click #loadMore": function(event, template){
     template.addMoreHangouts();
  },
  "change #hangoutFilter": function(event, template) {
    hangoutFilter = template.find("#hangoutFilter").value;
    template.hangoutFilter.set(hangoutFilter);
  }
});
