import QuillEditor from '../../libs/QuillEditor';

Template.createHangoutModal.rendered = function() {
  var templateInstance = Template.instance();
  var editorHostElement = templateInstance.$('[data-editor-host]').get(0);
  
  templateInstance.editor = QuillEditor.createEditor({
    container: editorHostElement
  });

  var start = this.$('#start-date-time-picker');
  var end = this.$('#end-date-time-picker');
  var set_end_block = this.$('#set-end-date-time-block')
  var set_end = this.$('#set-end-date-time')

  $('#d1,#d2,#d3').hide();

  // set_end_block.on("click", function(e){
  //   end.show();
  //   set_end_block.hide();
  // })
  end.show();

  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date()
  });

  end.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date(Date.now() + 60*60*1000*24) // 60*60*1000*24 = 24 hour interval
  });


  $('#end-date-select').on('change', function() {
      console.log($('#start-date-time').val());
      if($('option[value="undefined"]').is(':selected')){
          //console.log('start time plus one hour is:',moment($('#start-date-time').val(), "L LT").add(1, 'hour').format("L LT"));
          hour_24 = moment($('#start-date-time').val(), "L LT").add(24, 'hour').format("L LT")
          $('#end-date-time').val(hour_24);
      } else if ($('option[value="one"]').is(':selected')) {
          const hour_1 = moment($('#start-date-time').val(), "L LT").add(1, 'hour').format("L LT");
          $('#end-date-time').val(hour_1);
      } else if ($('option[value="one_five"]').is(':selected')) {
          const minutes_90 = moment($('#start-date-time').val(), "L LT").add(90, 'minutes').format("L LT");
          $('#end-date-time').val(minutes_90);
      } else if ($('option[value="two"]').is(':selected')) {
          const hour_2 = moment($('#start-date-time').val(), "L LT").add(2  , 'hour').format("L LT");
          $('#end-date-time').val(hour_2);
      } else if ($('option[value="three"]').is(':selected')) {
          const hour_3 = moment($('#start-date-time').val(), "L LT").add(3  , 'hour').format("L LT");
          $('#end-date-time').val(hour_3);
      } else if ($('option[value="custom"]').is(':selected')) {
          $('#end-date-select').hide();
      }

  });
  $('#start-date-time, .bootstrap-datetimepicker-widget > *').on('change', function() {
    console.log('changed start date');
    $('#end-date-select').trigger('change');
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
    const templateInstance = Template.instance();
    const topic = $('#topic').val();
    const description = QuillEditor.generatePlainTextFromDeltas(templateInstance.editor.getContents());
    const description_in_quill_delta = templateInstance.editor.getContents();
    const start = $('#start-date-time').val();
    // If date was not set, return 24 hours later. Else, return end date time
    const end = $('#end-date-time-picker').attr("style") === "display:none" ? new Date(Date.now() + 60*60*1000*24) : $('#end-date-time').val();
    const type = $('input[name="hangout-type"]:checked').val();

    //alert(description_in_quill_delta)

    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
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
