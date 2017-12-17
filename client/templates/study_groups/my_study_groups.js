Template.myStudyGroups.onCreated(function() {
  const title = "CodeBuddies | My Study Groups";
  const metaInfo = {
    name: "description",
    content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

  let instance = this;
  instance.limit = new ReactiveVar(30);
  instance.flag = new ReactiveVar(false);


  instance.autorun(function () {
    let limit = instance.limit.get();
    instance.subscribe('myStudyGroups', limit);

    const hangoutIds = StudyGroups.find({}, { fields: { _id: 1 } }).map(x => `cb${x._id}`);
    instance.subscribe('allHangoutParticipants', hangoutIds);
  });

  instance.loadStudyGroups = function() {
    return StudyGroups.find({}, {sort: {createdAt: 1}});
  }


});


Template.myStudyGroups.onRendered(function() {
  let instance = this;

  instance.scrollHandler = function(){

    if  ($(window).scrollTop() > ($(document).height() - $(window).height()) -20 && !instance.flag.get()){

      if(StudyGroups.find().count() === instance.limit.get()){
           instance.limit.set(instance.limit.get() + 9);
           $('body').addClass('stop-scrolling');
      }else{
         if(StudyGroups.find().count() < instance.limit.get()){
             instance.flag.set(true);
         }else {

         }
      }

    }


  }.bind(instance);
  $(window).on("scroll" ,instance.scrollHandler);
});

Template.myStudyGroups.helpers({
  studyGroups: function(){
    return StudyGroups.find();
  },
  status:function(){
    return  Template.instance().flag.get();
  },
  numParticipants: function(studyGroupId) {
    const hangoutId = `cb${studyGroupId}`;
    const appState = AppStats.findOne({ _id: hangoutId });
    if (appState && appState.participants ) {
      return appState.participants.length
    }
    return 0;
  }
});

Template.myStudyGroups.events({
  'click #newStudyGroup': function(event, template){
    event.preventDefault();
    Modal.show('newStudyGroupModal');
  }
});
