import QuillEditor from '../../libs/QuillEditor';

Template.cloneHangoutModal.onCreated(function () {
    this.subscribe('myStudyGroups');
});

Template.cloneHangoutModal.onRendered(function() {
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

  const instance = this;
  let roles = Meteor.user().roles;
  let studyGroupsKeys = [];

  Object.entries(roles).forEach(([key, value]) => {
    if(value.includes('owner') || value.includes('admin') || value.includes('moderator') && key !== 'CB'){
      studyGroupsKeys.push(key)
    }
  });
  // check for exempt_form_default_permission
  Object.entries(roles).forEach(([key, value]) => {
    if(value.includes('member') && key !== 'CB'){

      const item = StudyGroups.findOne({_id:key});
      if (item && item.exempt_form_default_permission) {
        studyGroupsKeys.push(key)
      }

    }
  });

  instance.autorun(() => {

    let studyGroups = [{id: "CB", text: "CodeBuddies Default"}];
    StudyGroups.find({_id:{$in:studyGroupsKeys}}).forEach((sg) => {
      studyGroups.push({id: sg._id, text: sg.title});
    });

    Meteor.setTimeout(function () {

      instance.$(".study-group-single", studyGroups).select2({
        placeholder: "Select a group you organize",
        data: studyGroups
      });

    },1500)

  });

});


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
    const groupId = $(".study-group-single").val();


    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      start: new Date(start),
      end: new Date(end),
      duration: duration,
      type: type,
      groupId: groupId
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

    if ($.trim(groupId) == '') {
      $(".study-group-single").focus();
      sweetAlert({
        title: TAPi18n.__("select_study_group"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
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
