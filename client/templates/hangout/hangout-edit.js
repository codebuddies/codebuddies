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
     const topic = $('#topic').val();
     const description = $('#description').val().replace(/\r?\n/g, '<br />');
     const start = $('#start-date-time').val();
     const end = $('#end-date-time').val();
     const type = $('input[name="hangout-type"]:checked').val();

     const data = {
       topic: topic,
       slug: topic.replace(/\s+/g, '-').toLowerCase(),
       description: description,
       start: new Date(start),
       end: new Date(end),
       type: type,
       hangoutId:Session.get("hangoutId"),
     };
     
      Meteor.call('editHangout', data, function(err, result) {
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
