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
    var topic1 = $('#topic').val();
    var desc1 = $('#description').val().replace(/\r?\n/g, '<br />');
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
      user_id: Meteor.userId(),
      username:Meteor.user().profile.name,
      email:Meteor.user().user_info.profile.email
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
