Template.editStudyGroupInfoModal.onCreated(function() {
  let instance = this;
  instance.processing = new ReactiveVar(false);
  instance.introCharCount = new ReactiveVar(140);
});

Template.editStudyGroupInfoModal.onRendered(function() {
  let instance = this;
  let introCharCount = $("#sgIntro").val().length || 0;
  instance.introCharCount.set(140 - introCharCount);
});

Template.editStudyGroupInfoModal.helpers({
  processing() {
    return Template.instance().processing.get();
  },
  introCharCount() {
    return Template.instance().introCharCount.get();
  }
});

Template.editStudyGroupInfoModal.events({
  "keyup #sgIntro": function(event, template) {
    let introCharCount = $("#sgIntro").val().length || 0;
    template.introCharCount.set(140 - introCharCount);
  },
  "submit .updateStudyGroupInfo": function(event, template) {
    event.preventDefault();

    $(".form-control").css({ border: "1px solid #cccccc" });

    if ($.trim(template.find("#sgIntro").value) == "") {
      $("#sgIntro").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Study Group Introduction", "warning", "growl-top-right");
    }
    if ($("#sgIntro").val().length > 140) {
      $("#sgIntro").css({ border: "#FF0000 1px solid" });
      return Bert.alert("Study Group Introduction", "warning", "growl-top-right");
    }

    const data = {
      id: this._id,
      introduction: $.trim(template.find("#sgIntro").value),
      description: $.trim(template.find("#sgDesc").value)
    };

    // console.log(data);
    template.processing.set(true);

    Meteor.call("updateStudyGroupInfo", data, function(error, result) {
      if (error) {
        template.processing.set(false);
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        template.processing.set(false);
        Bert.alert("Description updated!", "success", "growl-top-right");
        Modal.hide();
      }
    });
  }
});
