Template.studyGroupMemberDetail.onRendered(function() {
  const user = this.data;
  const studyGroupId = FlowRouter.getParam("studyGroupId");
  const instance = this;
  this.autorun(function() {
    instance.subscribe("studyGroupMemberDetail", studyGroupId, user.id);
  });
});

Template.studyGroupMemberDetail.helpers({
  user: function() {
    return Meteor.users.findOne({ _id: Template.instance().data.id });
  },
  groupId: function() {
    return FlowRouter.getParam("studyGroupId");
  },
  userRoles: function() {
    const roles = Meteor.users.findOne({ _id: Template.instance().data.id }).roles;
    const studyGroupId = FlowRouter.getParam("studyGroupId");
    return roles[studyGroupId].pop();
  }
});

Template.studyGroupMemberDetail.events({
  "change #authorization": function(event, template) {
    const user = this;

    const data = {
      user: {
        id: user._id,
        username: user.username,
        avatar: user.profile.avatar.default
      },
      role: template.find("#authorization").value,
      studyGroupId: FlowRouter.getParam("studyGroupId")
    };

    //console.log(data);

    Meteor.call("updateUserRoleForStudyGroup", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Modal.hide();
        Bert.alert("Role updated", "success", "growl-top-right");
      }
    });
  }
});
