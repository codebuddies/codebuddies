import _ from 'lodash';

Template.allDiscussions.onCreated(function() {
  const title = "CodeBuddies | Discussions";
  const metaInfo = {
    name: "description",
    content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  let instance = this;
  instance.limit = new ReactiveVar(10);
  instance.flag = new ReactiveVar(false);
  instance.tags = new ReactiveVar([]);
  instance.discussionFilter = new ReactiveVar('newest');

  let projection = new Object();
  instance.autorun(function () {
    let limit = instance.limit.get();

    FlowRouter.watchPathChange();
    let queryParams = FlowRouter.current().queryParams;
    let tags = [];
    instance.tags.set(tags)
    if (! _.isEmpty(queryParams)) {
      tags = queryParams.tags
      instance.tags.set(tags)
    }

    let discussionFilter = instance.discussionFilter.get() || 'newest';
    switch (discussionFilter) {
      case 'newest':
        projection.sort = {'created_at' : -1};
        break;
      case 'oldest':
        projection.sort = {'created_at' : 1};
        break;
      case 'most-commented':
        projection.sort = {'response_count' : -1};
        break;
      case 'least-commented':
        projection.sort = {'response_count' : 1};
        break;
      default:
      projection.sort = {'created_at' : -1};
    }

    instance.subscribe('allDiscussions', limit, discussionFilter, tags);
  });



  instance.loadDiscussions = function() {
    return Discussions.find({},projection);
  }

});

Template.allDiscussions.onRendered(function() {
    let instance = this;

    instance.scrollHandler = function(){

      if  ($(window).scrollTop() > ($(document).height() - $(window).height()) -20 && !instance.flag.get()){

        if(Discussions.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 10);
             $('body').addClass('stop-scrolling');
        }else{
           if(Discussions.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }else {

           }
        }

      }

    }.bind(instance);
    $(window).on("scroll" ,instance.scrollHandler);

});

Template.allDiscussions.helpers({
  discussions: function(){
    return Template.instance().loadDiscussions();
  },
  status:function(){
    return  Template.instance().flag.get();
  },
  discussionFilter: function() {
    return Template.instance().discussionFilter.get();
  },
  discussionSearchMode: function(){
    return Session.get('discussionSearchMode');
  },
  tags: function(){
    return Template.instance().tags.get();
  }
});

Template.allDiscussions.events({
  "click #addDiscussion" (event, template){
    const data = {
      _id: "CB",
      title: "CB",
      slug: "CB"
    }
    Modal.show("addDiscussionModal", data);
  },
  "click .newest": function(event, template) {
    event.preventDefault();
    template.discussionFilter.set('newest');
  },
  "click .oldest": function(event, template) {
    event.preventDefault();
    template.discussionFilter.set('oldest');
  },
  "click .most-commented": function(event, template) {
    event.preventDefault();
    template.discussionFilter.set('most-commented');
  },
  "click .least-commented": function(event, template) {
    event.preventDefault();
    template.discussionFilter.set('least-commented');
  },
  "click .clear-tags": function(event, template) {
    event.preventDefault();
    FlowRouter.go('/discussions');
  },
});

Template.allDiscussions.onDestroyed(function(){
    $(window).off("scroll", this.scrollHandler);
});
