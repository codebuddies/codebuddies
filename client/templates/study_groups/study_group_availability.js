Template.studyGroupAvailability.onCreated(function() {
  let instance = this;
  let studyGroupId = FlowRouter.getParam('studyGroupId');
  instance.subscribe('allStudyGroupAvailability', studyGroupId);

});

Template.studyGroupAvailability.helpers({
  availabilities (){
    // console.log(Availabilities.find({'study_group.id': FlowRouter.getParam('studyGroupId') }).count());

    return Availabilities.find({'study_group.id': FlowRouter.getParam('studyGroupId') });
  }
});

Template.studyGroupAvailability.events({
  "click #addSlot" (event, template){
     Modal.show("editStudyGroupAvailabilitySlotModal", this);
  },
});
