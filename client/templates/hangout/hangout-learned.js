Template.registerHelper("learningOwner", function(ownerid){
  if(Meteor.userId() === ownerid){
      return true;
  }else {
      return false;
  }

});

Template.hangoutLearned.events({
	'keyup textarea#learned-text': function(event) {
        //Check value and if 140 characters have been typed, the user can't type anymore
        let learnedCounterValue = 140;
		let maxChars = 140;
        var currentLength = $("textarea#learned-text").val().length;
        learnedCounterValue = maxChars - currentLength;
        $('.learnedCharactersLeft').text(learnedCounterValue).append(' <small><em>(Hit enter to submit)</em></small>');
	},
	 'keypress textarea#learned-text': function(event) {
	 	if (event.which === 13) {
		        if (!Meteor.userId()) {
		            sweetAlert({
		            	imageUrl: '/images/slack-signin-example.jpg',
        				imageSize: '140x120',
        				showCancelButton: true,
		                title: TAPi18n.__("you_are_almost_there"),
		                html: TAPi18n.__("continue_popup_text"),
		                confirmButtonText: TAPi18n.__("sign_in_with_slack"),
		                cancelButtonText: TAPi18n.__("not_now")
		            },
		            function(){
		              var options = {
		                requestPermissions: ['identify', 'users:read']
		              };
		              Meteor.loginWithSlack(options);
		            });
		        } else {
		            var learningStatus = $('#learned-text').val();

		            if ($.trim(learningStatus) == '') {
		                $('#topic').focus();
		                sweetAlert({
		                    title: TAPi18n.__("Please share something you've learned"),
		                    confirmButtonText: TAPi18n.__("ok"),
		                    type: 'error'
		                });
		                return;
		            }
		            var data = {
		                user_id: Meteor.userId(),
		                username: Meteor.user().username,
		                title: learningStatus,
		                hangout_id: this._id
		            }
		            Meteor.call("addLearning", data, function(error, result) {});
		            swal({
					  type: "success",
					  text: "Thank you for sharing what you learned!",
					  timer: 500,
					  showConfirmButton: false
					});
		            $('#learned-text').val('What did you learn?');
					$('.learnedCharactersLeft').text(140);
		        }
		    }
    },

});