Template.hangoutByGroup.onCreated(function(){
  let instance = this;

  instance.limit = new ReactiveVar(54);
  instance.flag = new ReactiveVar(false);
  instance.hangoutFilter = new ReactiveVar('live');

  instance.loadHangouts = function() {
    return Hangouts.find({}, {sort: {start: 1}});
  }


});

Template.hangoutByGroup.onRendered(function(){
  let instance = this;

  instance.autorun(function () {
    let limit = instance.limit.get();
    let hangoutFilter = instance.hangoutFilter.get();
    let groupId = instance.data.id;
    instance.subscribe('hangoutByGroupId', groupId, limit, hangoutFilter);
  });


});

Template.hangoutByGroup.helpers({
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

Template.hangoutByGroup.events({
  "click #loadMore": function(event, template){
    template.addMoreHangouts();
  },
  "change #hangoutFilter": function(event, template) {
    hangoutFilter = template.find("#hangoutFilter").value;
    template.flag.set(false);
    template.hangoutFilter.set(hangoutFilter);
  }
});

Template.hangoutByGroup.onDestroyed(function(){
    $(window).off("scroll", this.scrollHandler);
});
