Template.myStudyGroups.onCreated(function() {
  const title = "CodeBuddies | My Study Groups";
  const metaInfo = {
    name: "description",
    content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  let instance = this;
  instance.limit = new ReactiveVar(54);

  instance.autorun(() => {
      let limit = instance.limit.get();
      this.subscribe('myStudyGroups', limit);
  });

});

Template.myStudyGroups.helpers({
  studyGroups: function(){
    return StudyGroups.find();

  }
});

Template.myStudyGroups.events({
  "click #newStudyGroup": function(event, template){
    event.preventDefault();

  },
  "click #findMeStudyGroup": function(event, template){
    event.preventDefault();

  }
});
