import QuillEditor from "../../libs/QuillEditor";

Template.createHangoutModal.onCreated(function() {
  this.subscribe("myStudyGroups");
});
Template.createHangoutModal.onRendered(function() {
  var start = this.$("#start-date-time-picker");
  var templateInstance = Template.instance();
  var editorHostElement = templateInstance.$("[data-editor-host]").get(0);

  templateInstance.editor = QuillEditor.createEditor({
    container: editorHostElement
  });

  //instructions for start date time picker
  start.datetimepicker({
    ignoreReadonly: true,
    widgetPositioning: { horizontal: "auto", vertical: "bottom" },
    minDate: new Date()
  });

  $("#d1,#d2,#d3").hide();

  $("#sId").hover(
    function() {
      $("#d1").show();
    },
    function() {
      $("#d1").hide();
    }
  );

  $("#tId").hover(
    function() {
      $("#d2").show();
    },
    function() {
      $("#d2").hide();
    }
  );

  $("#cId").hover(
    function() {
      $("#d3").show();
    },
    function() {
      $("#d3").hide();
    }
  );

  const instance = this;
  instance.studyGroupId = FlowRouter.getParam("studyGroupId");
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

      if (typeof instance.studyGroupId !== "undefined" && instance.studyGroupId !== "") {
        instance
          .$(".study-group-single")
          .val(instance.studyGroupId)
          .trigger("change");
      }
    }, 1500);
  });
});

Template.createHangoutModal.events({
  "click input#external-checkbox": function(event) {
    $("#external-fields").toggle();
  },
  "click #create-hangout": function(e, template) {
    const templateInstance = template;
    const topic = $("#topic").val();
    const description = QuillEditor.generatePlainTextFromDeltas(templateInstance.editor.getContents());
    const description_in_quill_delta = templateInstance.editor.getContents();
    const start = $("#start-date-time").val();
    const startDate = new Date(start);
    // If date was not set, return 24 hours later. Else, return end date time
    const duration = Number($("#end-date-time").val()) || 1440;
    const end = new Date(startDate.getTime() + 1000 * 60 * duration);
    const groupId = $(".study-group-single").val();
    const externalCheckbox = $('input[name="externalCheckbox"]').prop("checked");
    const externalButtonText = $('input[name="externalButtonText"]').val();
    const externalURL = $('input[name="externalURL"]').val();

    const type = $('input[name="hangout-type"]:checked').val();

    const data = {
      topic: topic,
      slug: topic.replace(/\s+/g, "-").toLowerCase(),
      description: description,
      description_in_quill_delta: description_in_quill_delta,
      start: new Date(start),
      end: end,
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

    if ($.trim(description) == "") {
      $("#description").focus();
      swal({
        title: TAPi18n.__("enter_description"),
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

    if (externalCheckbox == true && $.trim(externalButtonText) == "") {
      $("#externalButtonText").focus();
      swal({
        title: TAPi18n.__("external_button_text"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
      return;
    }

    if (externalCheckbox == true && $.trim(externalURL) == "") {
      $("#externalURL").focus();
      swal({
        title: TAPi18n.__("external_URL"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "error"
      });
      return;
    }

    // console.log(data);

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
      } else {
        console.log(err);
      }
    });
  }
});
