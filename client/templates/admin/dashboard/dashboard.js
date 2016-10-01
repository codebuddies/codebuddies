
Template.dashboard.helpers({
  dailyNewUsersCount:function(){
      return ReactiveMethod.call('dailyNewUsersCount');
  },
  monthlyActiveUsersCount:function(){
      return ReactiveMethod.call('monthlyActiveUsersCount');
  },
  onlineUserCount:function(){
      return ReactiveMethod.call('onlineUserCount');
  },
  blockedUserCount:function(){
      return ReactiveMethod.call('blockedUserCount');
  },
  archivedUserCount:function(){
    return ReactiveMethod.call('archivedUserCount');
  }
});

Template.dashboard.events({
  "click #foo": function(event, template){

  }
});
