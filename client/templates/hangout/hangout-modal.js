Template.createHangoutModal.rendered = function() {
  var start = this.$('#start-date-time-picker');
  var end = this.$('#end-date-time-picker');
  var dateFrom = new Date();
  var dateTo = new Date();
  dateTo.setHours(dateTo.getHours()+1);
  start.datetimepicker({
    ignoreReadonly: true
  });
  end.datetimepicker({
    ignoreReadonly: true,
    useCurrent: false
  });
  start.on("dp.change", function (e) {
    end.data("DateTimePicker").minDate(e.date);
  });
  end.on("dp.change", function (e) {
    start.data("DateTimePicker").maxDate(e.date);
  });
  start.data("DateTimePicker").date(dateFrom);
  end.data("DateTimePicker").date(dateTo);
};

Template.createHangoutModal.events({
  'click #create-hangout': function(e) {
    var topic1 = $('#topic').val();
    var desc1 = $('#description').val();
    var start1 = $('#start-date-time').val();
    var end1 = $('#end-date-time').val();
    var type1 = $('input[name="hangout-type"]:checked').val();
    console.log(start1);
    //console.log(new Date(start1));

    var data = {
      topic: topic1,
      description: desc1,
      start: new Date(start1),
      end: new Date(end1),
      type: type1,
      user_id: Meteor.userId()
    };
    console.log(data.start);
    console.log(data.end);

    if ($.trim(start1) == '') {
      sweetAlert({
        title: TAPi18n.__("select_start_time"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(end1) == '') {
      sweetAlert({
        title: TAPi18n.__("select_end_time"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(topic1) == '') {
      $('#topic').focus();
      sweetAlert({
        title: TAPi18n.__("enter_topic"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(desc1) == '') {
      $('#description').focus();
      sweetAlert({
        title: TAPi18n.__("enter_description"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    Meteor.call('createHangout', data, function(err, result) {
      if (result) {
        Modal.hide();
        sweetAlert({
          title: TAPi18n.__("hangout_created_title"),
          text: TAPi18n.__("hangout_created_message"),
          confirmButtonText: TAPi18n.__("ok"),
          type: 'success',
          closeOnConfirm: true
        });
      }
    });
  }
});
