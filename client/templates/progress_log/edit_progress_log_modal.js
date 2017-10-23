import QuillEditor from '../../libs/QuillEditor';


Template.editProgressLogModal.onCreated(function(){
  let instance = this;
  instance.quillDelta = new ReactiveVar("OKEY");
  instance.autorun(function(){
    instance.subscribe('progressLogsById', instance.data._id);
    const progressLog = ProgressLogs.findOne({"_id": instance.data._id});
    instance.quillDelta.set(progressLog.description_in_quill_delta);

  });

});

Template.editProgressLogModal.onRendered(function() {
  let instance = this;
  const editorHostElement = instance.$('[data-editor-progress-log]').get(0);
  instance.editor = QuillEditor.createEditor({
    container: editorHostElement,
    options: {
      placeholder: 'Please share something you learned or accomplished.',
    }
  });

  instance.editor.setContents("Loading...");
  Meteor.setTimeout(function () {
    instance.editor.setContents(instance.quillDelta.get());
  }, 1500);


});

Template.editProgressLogModal.events({
  'click #updateProgressLog': function(event, template) {
    event.preventDefault();

    const title = $('#title').val();
    const description = QuillEditor.generatePlainTextFromDeltas(template.editor.getContents());
    const description_in_quill_delta = template.editor.getContents();


    const data = {
      id: this._id,
      title: title,
      slug: title.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta
    }


    if ($.trim(title) == '') {
      $('#title').focus();
      return Bert.alert( TAPi18n.__("empty_log_title"), 'warning', 'growl-top-right' );
    }

    if ($.trim(description) == '') {
      return Bert.alert( TAPi18n.__("empty_log_body"), 'warning', 'growl-top-right' );
    }




    console.log(data);

    Meteor.call('updateProgressLog', data, function(err, result) {
      if (result) {
        Modal.hide();

        return Bert.alert({
          type: 'success',
          style: 'fixed-top',
          title: TAPi18n.__("progress_log_updated"),
          icon: 'fa-trophy'
        });

      } else {
        console.log(err)
      }
    });
  }
});
