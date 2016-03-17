Template.editLearningModal.rendered = function() {

};

Template.editLearningModal.events({
  'click #update-learning': function() {
    var learning = $('#topic').val();
    var learningId = Session.get('learningId');
    console.log("about to update " + learningId + "with " + learning);
    Meteor.call('editLearning', learning, learningId);
    Modal.hide();
  }
});
