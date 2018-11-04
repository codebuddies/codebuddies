Template.dailyNewUser.helpers({
  users: function() {
    return Meteor.users.find({
      createdAt: { $gt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    });
  }
});

Template.dailyNewUser.events({
  "click #foo": function(event, template) {}
});
