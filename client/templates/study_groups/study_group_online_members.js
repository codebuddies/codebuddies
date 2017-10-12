Template.studyGroupOnlineMembers.helpers({
  onlineUsers: function(){
    const onlineUsernames =  Meteor.users.find({ "status.online": true }, { fields: { username: 1 }})
                        .fetch()
                        .map(m => m.username);
    const studyGroup = StudyGroups.findOne({_id:FlowRouter.getParam('studyGroupId')});
    if (studyGroup) {
      const onlineMembers =  studyGroup.members
                    .filter(m => onlineUsernames.indexOf(m.name) >= 0);
      return onlineMembers;
    }
    return [];
  }
});
