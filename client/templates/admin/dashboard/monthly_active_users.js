
Template.monthlyActiveUsers.helpers({
  users:function(){
    return Meteor.users.find({'status.lastLogin.date':{$gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}});
  }
});

Template.monthlyActiveUsers.events({
  "click #foo": function(event, template){

  }
});
