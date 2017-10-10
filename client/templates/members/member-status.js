
Template.memberStatus.events({
	'keyup textarea#status-text': function(event) {
        //Check value and if 140 characters have been typed, the user can't type anymore
        let learnedCounterValue = 140;
		let maxChars = 140;
        var currentLength = $("textarea#status-text").val().length;
        statusCounterValue = maxChars - currentLength;
        $('.statusCharactersLeft').text(statusCounterValue).append(' <small><em>(Hit enter to submit)</em></small>');
	},
  'keypress textarea#status-text': function(event) {
	 	if (event.which === 13) {
      var memberStatus = $('#status-text').val();

      if ($.trim(memberStatus) == '') {
        $('#topic').focus();
        sweetAlert({
          title: TAPi18n.__("Please share your current status"),
          confirmButtonText: TAPi18n.__("ok"),
          type: 'error'
        });
        return;
      }
      /*var data = {
        user_id: Meteor.userId(),
        username: Meteor.user().username,
        title: learningStatus,
        hangout_id: FlowRouter.getParam('hangoutId'),
        study_group_id: FlowRouter.getParam('studyGroupId')
      }*/
      /*
      Meteor.call("addLearning", data, function(error, result) {
        if (error) {
          console.log(error);
        }
        if (result) {
          swal({
             type: "success",
             text: "Thank you for sharing what you learned!",
             timer: 500,
             showConfirmButton: false
           });
           $('#learned-text').val('').blur();
           $('.learnedCharactersLeft').text(140);
        }
      });
      */
    }
  }
});
