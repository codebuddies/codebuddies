Template.reportHangoutModal.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.reportHangoutModal.events({
  'click #report-hangout': function(e) {

    var report = {
      hangoutId:Session.get("hangoutId"),
      hostId:Session.get("hostId"),
      hostUsername : Session.get("hostUsername"),
      category: $('input[name="report-category"]:checked').val(),
      reporterId: Meteor.userId()
    };

    Meteor.call('reportHangout', report, function(err, result) {
      if (result) {
        Modal.hide();
        sweetAlert({
          title: TAPi18n.__("hangout_has_been_reported"),
          text: TAPi18n.__("hangout_reported_message"),
          confirmButtonText: TAPi18n.__("ok"),
          type: 'success',
          closeOnConfirm: true
        });
      }
    });
  }

});
