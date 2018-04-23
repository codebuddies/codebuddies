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
  'click #createProgressLog': function(event, template) {



    const title = $('#title').val();
    const description = QuillEditor.generatePlainTextFromDeltas(template.editor.getContents());
    const description_in_quill_delta = template.editor.getContents();

    const study_group_id = this.parent_id;
    const study_group_title = this.parent_title;



    const data = {
      title: title,
      slug: title.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      study_group_id : study_group_id,
      study_group_title: study_group_title
    };


    if ($.trim(title) == '') {
      $('#title').focus();
      return Bert.alert( TAPi18n.__("empty_log_title"), 'warning', 'growl-top-right' );
    }

    if ($.trim(description) == '') {
      return Bert.alert( TAPi18n.__("empty_log_body"), 'warning', 'growl-top-right' );
    }




    console.log(data);

    Meteor.call('createNewProgressLog', data, function(err, result) {
      if (result) {
        Modal.hide();

        return Bert.alert({
          type: 'success',
          style: 'fixed-top',
          title: TAPi18n.__("progress_log_created_title"),
          message: TAPi18n.__("progress_log_created_text"),
          icon: 'fa-trophy'
        });

      } else {
        console.log(err)
      }
    });
  }
});
