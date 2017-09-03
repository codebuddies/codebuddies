Template.studyGroupActivities.onCreated(function() {
  let instance = this;
  instance.studyGroupId = FlowRouter.getParam('studyGroupId');
  this.autorun(() => {
      //TODO : pagination
      instance.subscribe("allStudyGroupActivities", 50, instance.studyGroupId);
  });

});


Template.studyGroupActivities.helpers({
  activities: function() {
    return Activities.find({'study_group.id': FlowRouter.getParam('studyGroupId') });
  }
});
