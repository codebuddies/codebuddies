Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

Meteor.publish("learnings", function() {
  return Learnings.find();
});

Meteor.publish("hangouts", function() {
  return Hangouts.find();
});
