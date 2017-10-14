import QuillEditor from '../../libs/QuillEditor';

Template.newProgressLogModal.onRendered(function() {
  let instance = this;
  const editorHostElement = instance.$('[data-editor-progress-log]').get(0);
  instance.editor = QuillEditor.createEditor({
    container: editorHostElement,
    options: {
      placeholder: 'Please share something you learned or accomplished.',
    }
  });

});

Template.newProgressLogModal.events({
  'click #create-progress-log': function(event, template) {

    const title = $('#title').val();
    const description = QuillEditor.generatePlainTextFromDeltas(template.editor.getContents());
    const description_in_quill_delta = template.editor.getContents();


    const data = {
      title: title,
      slug: title.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta
    };


    if ($.trim(title) == '') {
      $('#title').focus();
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




    console.log(data);

    // Meteor.call('createHangout', data, function(err, result) {
    //   if (result) {
    //     Modal.hide();
    //     sweetAlert({
    //       title: TAPi18n.__("hangout_created_title"),
    //       text: TAPi18n.__("hangout_created_message"),
    //       confirmButtonText: TAPi18n.__("ok"),
    //       type: 'success',
    //       closeOnConfirm: true
    //     });
    //     FlowRouter.go("hangouts");
    //   } else {
    //     console.log(err)
    //   }
    // });
  }
});
