import QuillEditor from '../../libs/QuillEditor';

Template.editHangoutModal.rendered = function() {
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
    ignoreReadonly: true
  });


};

Template.editHangoutModal.events({
	 'click #edit-hangout': function() {
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
       type: type,
       hangoutId:Session.get("hangoutId"),
     };

      Meteor.call('editHangout', data, function(err, result) {
        if (result) {
          Modal.hide();
          sweetAlert({
            title: TAPi18n.__("hangout_edited_title"),
            text: TAPi18n.__("hangout_created_message"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'success',
            closeOnConfirm: true
          });
        }
      });
    }
});
