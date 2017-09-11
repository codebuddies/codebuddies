Template.studyGroupDescription.events({
  "click #editDescription": function(event, template){
     event.preventDefault();
     Modal.show('editStudyGroupInfoModal', this);
  },
})
