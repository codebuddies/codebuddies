import QuillEditor from '../../libs/QuillEditor';

Template.createHangoutModal.onCreated(function () {
    this.subscribe('myStudyGroups');
});
Template.createHangoutModal.rendered = function() {
  var start = this.$('#start-date-time-picker');
  var templateInstance = Template.instance();
  var editorHostElement = templateInstance.$('[data-editor-host]').get(0);

  templateInstance.editor = QuillEditor.createEditor({
    container: editorHostElement
  });

  //instructions for start date time picker
  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: 'auto', vertical: 'bottom'},
    minDate: new Date()
  });

  $('#d1,#d2,#d3').hide();

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

Template.createHangoutModal.helpers({
  studyGroups() {
    let roles = Meteor.user().roles;
    let studyGroups = [];

    //this won't work on safari and opera.
    if (Object.entries) {
      Object.entries(roles).forEach(([key, value]) => {
        if(value.includes('owner') || value.includes('moderator') && key !== 'CB'){
          studyGroups.push(key)
        }
      });
    }
    //this won't work on safari and opera. end



    return StudyGroups.find({_id:{$in:studyGroups}});
  }
});
Template.createHangoutModal.events({
  'click #create-hangout': function(e, template) {
    const templateInstance = template;
    const topic = $('#topic').val();
    const description = QuillEditor.generatePlainTextFromDeltas(templateInstance.editor.getContents());
    const description_in_quill_delta = templateInstance.editor.getContents();
    const start = $('#start-date-time').val();
    const startDate = new Date(start);
    // If date was not set, return 24 hours later. Else, return end date time
    const duration = Number($('#end-date-time').val()) || 1440;
    const end = new Date(startDate.getTime() + (1000*60* duration));

    const groupId = $('#studyGroup').val();


    const type = $('input[name="hangout-type"]:checked').val();

    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, '-').toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      start: new Date(start),
      end: end,
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

    if ($.trim(description) == '') {
      $('#description').focus();
      sweetAlert({
        title: TAPi18n.__("enter_description"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
      return;
    }

    if ($.trim(groupId) == 'default') {
      $('#studyGroup').focus();
      sweetAlert({
        title: TAPi18n.__("select_study_group"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'error'
      });
    }


    // console.log(data);

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
        FlowRouter.go("hangouts");
      }
    });
  }
});
