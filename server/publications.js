Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

Meteor.publish("learnings", function(limit) {
  return Learnings.find({}, {limit: limit});
});

Meteor.publish("hangouts", function() {
  return Hangouts.find();
});
