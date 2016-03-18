Template.editLearningModal.events({
  'click #update-learning': function() {
    var learning = $('#topic').val();
    var learningId = Session.get('learningId');
    console.log("about to update " + learningId + "with " + learning);
    Meteor.call('editLearning', learning, learningId, Meteor.userId(), function(err, result) {
        console.log(result + ' this is the result');
        if (result) {
          Modal.hide();
          sweetAlert({
            title: TAPi18n.__("hangout_edited_title"),
            text: TAPi18n.__("hangout_created_message"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'success',
            closeOnConfirm: true
          });
        }
      });
    Modal.hide();
  }
});
