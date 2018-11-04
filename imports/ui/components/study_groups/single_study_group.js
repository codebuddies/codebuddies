Template.singleStudyGroup.onCreated(function() {
  let instance = this;
  instance.studyGroupId = FlowRouter.getParam("studyGroupId");
  instance.hangoutId = `cb${instance.studyGroupId}`;
  instance.autorun(() => {
    instance.subscribe("studyGroupById", instance.studyGroupId);
    instance.subscribe("hangoutParticipants", instance.hangoutId);
  });
});

Template.singleStudyGroup.onRendered(function() {
  const title = "CodeBuddies | Study Groups";
  const metaInfo = {
    name: "description",
    content:
      "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.singleStudyGroup.helpers({
  studyGroup: function() {
    return StudyGroups.findOne({ _id: FlowRouter.getParam("studyGroupId") });
  },
  usersOnlineCount: function() {
    return Meteor.users.find({ "status.online": true }).count();
  },
  resourcesCount: function() {
    return Resources.find().count();
  },
  learningsCount: function() {
    return Learnings.find().count();
  },
  numParticipants: function() {
    const appState = AppStats.findOne({ _id: Template.instance().hangoutId });
    if (appState && appState.participants) {
      return appState.participants.length;
    }
    return 0;
  }
});

Template.singleStudyGroup.events({
  "click #hide-sidebar": function() {
    $(".study-group-sidebar").hide();
    $(".study-group-body")
      .removeClass("col-md-9")
      .addClass("col-md-10 col-md-offset-1");
    $("#show-sidebar").fadeIn();
  },
  "click #show-sidebar": function() {
    $(".study-group-sidebar").show();
    $(".study-group-body")
      .removeClass("col-md-10 col-md-offset-1")
      .addClass("col-md-9");
    $("#show-sidebar").hide();
  },
  "click #newHangout": function(event) {
    Modal.show("createHangoutModal");
  },
  "click .joinStudyGroup": function(event, template) {
    event.preventDefault();

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    };

    Meteor.call("joinStudyGroup", data, function(error, result) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        return Bert.alert("You have joined the study group!", "success", "growl-top-right");
      }
    });
  },
  "click .leaveStudyGroup": function(event, template) {
    event.preventDefault();

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    };

    Meteor.call("leaveStudyGroup", data, function(error, result) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        return Bert.alert("You have left the study group!", "success", "growl-top-right");
      }
    });
  },
  "click .memberDetail": function(event, template) {
    event.preventDefault();
    return Modal.show("studyGroupMemberDetail", this);
  },
  "click #editTitle": function(event, template) {
    event.preventDefault();
    Modal.show("editStudyGroupTitleModal", this);
  }
});
