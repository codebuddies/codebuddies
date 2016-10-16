Template.hangoutBoard.onCreated(function(){
  const title = "CodeBuddies | Learn and chat about code!";
  const metaInfo = {
    name: "description",
    content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.hangoutBoard.onCreated(function() {
   let instance = this;
   instance.limit = new ReactiveVar(54);
   instance.flag = new ReactiveVar(false);
   instance.hangoutFilter = new ReactiveVar('live');



   instance.autorun(function () {
     let limit = instance.limit.get();
     let hangoutFilter = instance.hangoutFilter.get()
     instance.subscribe('hangoutBoard', limit, hangoutFilter);
   });

   instance.loadHangouts = function() {
     return Hangouts.find({}, {sort: {start: 1}});
   }

});

Template.hangoutBoard.onRendered(function() {
    let instance = this;
    let hangoutFilter = instance.hangoutFilter.get() || 'live';
    instance.hangoutFilter.set(hangoutFilter);

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



Template.hangoutBoard.helpers({
  hangouts:function(){
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
    template.flag.set(false);
    template.hangoutFilter.set(hangoutFilter);
  }
});

Template.hangoutBoard.onDestroyed(function(){
    $(window).off("scroll", this.scrollHandler);
});
