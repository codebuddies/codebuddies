Template.registerHelper("learningOwner", function(ownerid){
  if(Meteor.userId() === ownerid){
      return true;
  }else {
      return false;
  }

});

Template.hangoutLearned.events({
	 'keypress textarea#learned-text': function(event) {
	 	if (event.which === 13) {
		        if (!Meteor.userId()) {
		            sweetAlert({
		                title: TAPi18n.__("you_are_almost_there"),
		                text: TAPi18n.__("login_update_status"),
		                confirmButtonText: TAPi18n.__("sign_in_with_slack"),
		                type: 'info'
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