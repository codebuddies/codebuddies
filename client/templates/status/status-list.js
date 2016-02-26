Template.statusList.helpers({
  usersOnlineCount:function(){
    return Meteor.users.find({ "status.online": true }).count();
  },
  usersOnline:function(){
    return Meteor.users.find({ "status.online": true });
  },
  isWorking: function(type) {
    return type == 'working';
  },
  learnedUsersCount: function() {
    return Learnings.find({}).count();
  },
  learnings: function() {
    return Learnings.find({}, { sort: { timestamp: -1 }});
  }
});
