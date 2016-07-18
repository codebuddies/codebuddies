Template.cloneHangoutModal.rendered = function() {
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


Template.cloneHangoutModal.events({
  'click #clone-hangout': function(e) {

    const topic = $('#topic').val();
    const description = $('#description').val().replace(/\r?\n/g, '<br />');
    const start = $('#start-date-time').val();
    const end = $('#end-date-time').val();
    const type = $('input[name="hangout-type"]:checked').val();
    console.log(start);


    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      start: new Date(start),
      end: new Date(end),
      type: type
    };

    console.log(data.start);
    console.log(data.end);

    if ($.trim(start) == '') {
      sweetAlert({
        title: TAPi18n.__("select_start_time"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(end) == '') {
      sweetAlert({
        title: TAPi18n.__("select_end_time"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(topic) == '') {
      $('#topic').focus();
      sweetAlert({
        title: TAPi18n.__("enter_topic"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(description) == '') {
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
