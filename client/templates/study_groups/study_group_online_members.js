Template.studyGroupOnlineMembers.helpers({
  onlineUsers: function(){
    let onlineUsernames =  Meteor.users.find({ "status.online": true }, { fields: { username: 1 }})
                        .fetch()
                        .map(m => m.username);
    let onlineMembers =  StudyGroups.findOne({_id:FlowRouter.getParam('studyGroupId')})
                    .members
                    .filter(m => onlineUsernames.indexOf(m.name) >= 0);
    return onlineMembers;
  }
});
