Template.editHangoutModal.rendered = function() {
  var start = this.$('#start-date-time-picker');
  var end = this.$('#end-date-time-picker');

  //dateTo.setHours(dateTo.getHours()+1);
  start.datetimepicker({
    ignoreReadonly: true
  });
  end.datetimepicker({
    ignoreReadonly: true,
    useCurrent: false
  });

};

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
      //console.log(data);
      var hangoutId = Session.get('hangoutId');
      console.log(hangoutId + ' second');

      Meteor.call('editHangout', data, hangoutId, function(err, result) {
        console.log(result);
        if (result) {
          Modal.hide();
          sweetAlert({
            title: TAPi18n.__("hangout_edited_title"),
            text: TAPi18n.__("hangout_created_message"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'success',
            closeOnConfirm: true
          });
        } else {
          //console.log(err.reason);
          //console.log("there was an error");
        	//console.log(data);
          //console.log(hangoutId);
        }
      });
    }
});
