import QuillEditor from "../../libs/QuillEditor";

Template.cloneHangoutModal.onCreated(function() {
  this.subscribe("myStudyGroups");
});

Template.cloneHangoutModal.onRendered(function() {
  var templateInstance = Template.instance();
  var editorHostElement = templateInstance.$("[data-editor-host]").get(0);
  var start = this.$("#start-date-time-picker");

  templateInstance.editor = QuillEditor.createEditor({
    container: editorHostElement
  });

  templateInstance.editor.setContents(
    templateInstance.data.hangout.data.description_in_quill_delta || templateInstance.data.hangout.data.description
  );

  //instructions for start date time picker
  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: "auto", vertical: "bottom" },
    minDate: new Date()
  });

  //whether external checkbox is checked
  const external_fields = $("#external-fields");
  if ($("input#external-checkbox").is(":checked") === true) {
    external_fields.show();
  } else {
    external_fields.hide();
  }

  const instance = this;
  instance.autorun(() => {
    let roles = Meteor.user().roles;
    let studyGroupsKeys = [];

    Object.entries(roles).forEach(([key, value]) => {
      if (value.includes("owner") || value.includes("admin") || (value.includes("moderator") && key !== "CB")) {
        studyGroupsKeys.push(key);
      } else if (value.includes("member") && key !== "CB") {
        // check for exempt_from_default_permission
        if (StudyGroups.findOne({ _id: key }) && StudyGroups.findOne({ _id: key }).exempt_from_default_permission) {
          studyGroupsKeys.push(key);
        }
      }
    });

    let studyGroups = [{ id: "CB", text: "CodeBuddies Default" }];
    StudyGroups.find({ _id: { $in: studyGroupsKeys } }).forEach(sg => {
      studyGroups.push({ id: sg._id, text: sg.title });
    });

    Meteor.setTimeout(function() {
      instance.$(".study-group-single", studyGroups).select2({
        placeholder: "Select a group you organize",
        data: studyGroups
      });

      const groupId = templateInstance.data.hangout.data.group.id || "";
      if (groupId !== "") {
        instance
          .$(".study-group-single")
          .val(groupId)
          .trigger("change");
      }
    }, 1500);
  });
});

Template.cloneHangoutModal.events({
  "click input#external-checkbox": function(event) {
    $("#external-fields").toggle();
  },
  "click #clone-hangout": function(e) {
    var templateInstance = Template.instance();

    const topic = $("#topic").val();
    const description = QuillEditor.generatePlainTextFromDeltas(templateInstance.editor.getContents());
    const description_in_quill_delta = templateInstance.editor.getContents();
    const start = $("#start-date-time").val();
    const startDate = new Date(start);
    // If date was not set, return 24 hours later. Else, return end date time
    const duration = Number($("#end-date-time").val()) || 1440;
    const end = new Date(startDate.getTime() + 1000 * 60 * duration);
    const type = $('input[name="hangout-type"]:checked').val();
    const groupId = $(".study-group-single").val();
    const externalCheckbox = $('input[name="externalCheckbox"]').prop("checked");
    const externalButtonText = $('input[name="externalButtonText"]').val();
    const externalURL = $('input[name="externalURL"]').val();

    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, "-").toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      start: new Date(start),
      end: new Date(end),
      duration: duration,
      type: type,
      groupId: groupId,
      externalCheckbox: externalCheckbox,
      externalButtonText: externalButtonText,
      externalURL: externalURL
    };

    if ($.trim(start) == "") {
      swal({
        title: TAPi18n.__("select_start_time"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
      return;
    }

    if ($.trim(topic) == "") {
      $("#topic").focus();
      swal({
        title: TAPi18n.__("enter_topic"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
      return;
    }

    if ($.trim(groupId) == "") {
      $(".study-group-single").focus();
      swal({
        title: TAPi18n.__("select_study_group"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
    }

    if ($.trim(description) == "") {
      $("#description").focus();
      swal({
        title: TAPi18n.__("enter_description"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
      return;
    }

    Meteor.call("createHangout", data, function(err, result) {
      if (result) {
        Modal.hide();
        swal({
          title: TAPi18n.__("hangout_created_title"),
          text: TAPi18n.__("hangout_created_message"),
          confirmButtonText: TAPi18n.__("ok"),
          type: "success",
          closeOnConfirm: true
        });
        FlowRouter.go("hangouts");
      }
    });
  }
});
