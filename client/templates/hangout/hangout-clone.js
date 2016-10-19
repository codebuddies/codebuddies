import QuillEditor from '../../libs/QuillEditor';

Template.cloneHangoutModal.rendered = function() {
  var templateInstance = Template.instance();
  var editorHostElement = templateInstance.$('[data-editor-host]').get(0);
  var start = this.$('#start-date-time-picker');

  templateInstance.editor = QuillEditor.createEditor({
    container: editorHostElement
  });

  templateInstance.editor.setContents(templateInstance.data.hangout.data.description_in_quill_delta ||
                                      templateInstance.data.hangout.data.description)


  //instructions for start date time picker
  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date()
  });

};


Template.cloneHangoutModal.events({
  'click #clone-hangout': function(e) {
    var templateInstance = Template.instance();

    const topic = $('#topic').val();
    const description = QuillEditor.generatePlainTextFromDeltas(templateInstance.editor.getContents());
    const description_in_quill_delta = templateInstance.editor.getContents();
    const start = $('#start-date-time').val();
    const startDate = new Date(start);
    // If date was not set, return 24 hours later. Else, return end date time
    const duration = Number($('#end-date-time').val()) || 1440;
    const end = new Date(startDate.getTime() + (1000*60* duration));
    const type = $('input[name="hangout-type"]:checked').val();


    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      start: new Date(start),
      end: new Date(end),
      duration: duration,
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
