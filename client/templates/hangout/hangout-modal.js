Template.createHangoutModal.rendered = function() {
  var start = this.$('#start-date-time-picker');
  var end = this.$('#end-date-time-picker');

  $('#d1,#d2,#d3').hide();

  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date()
  });

  end.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date()
  });

  start.on("dp.change", function (e) {
    //current start date & time
    var minEndDate = new Date(e.date.valueOf());
    // min time duration of hangout in hours
    var interval = 1
    //min end date & time = current start date & time + interval
    minEndDate.setHours(minEndDate.getHours() + interval);
    //setting end date & time
    end.data("DateTimePicker").date(minEndDate);
    //setting end date & time minLimit
    end.data("DateTimePicker").minDate(minEndDate);
  });

  $('#sId').hover(function(){
    $('#d1').show();
  },function(){
    $('#d1').hide();
  });

  $('#tId').hover(function(){
    $('#d2').show();
  },function(){
    $('#d2').hide();
  });

  $('#cId').hover(function(){
    $('#d3').show();
  },function(){
    $('#d3').hide();
  });



};

Template.createHangoutModal.events({
  'click #create-hangout': function(e) {
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
