Template.studyGroupOnlineMembers.helpers({
  onlineUsers: function() {
    const onlineUsernames = Meteor.users
      .find({ "status.online": true }, { fields: { id: 1 } })
      .fetch()
      .map(m => m._id);
    const studyGroup = StudyGroups.findOne({ _id: FlowRouter.getParam("studyGroupId") });
    if (studyGroup) {
      const onlineMembers = studyGroup.members.filter(m => onlineUsernames.indexOf(m.id) >= 0);
      return onlineMembers;
    }
    return [];
  }
});
