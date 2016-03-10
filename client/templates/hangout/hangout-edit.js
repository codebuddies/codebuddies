Template.editHangoutModal.events({
	 'click #edit-hangout': function() {
	    var topic1 = $('#topic').val();
    	var desc1 = $('#description').val();
    	var start1 = $('#start-date-time').val();
    	var end1 = $('#end-date-time').val();
    	var type1 = $('input[name="hangout-type"]:checked').val();

	  var data = {
      	topic: topic1,
      	description: desc1,
      	start: new Date(start1),
      	end: new Date(end1),
      	type: type1
      };

      Meteor.call('editHangout', data, hangout_id, function(error, result) {
        if (result) {
          sweetAlert({
            title: TAPi18n.__("hangout_edited_title"),
            text: TAPi18n.__("hangout_created_message"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'info'
          });
        }
      });
    }
});