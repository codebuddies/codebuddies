Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

Meteor.publish("learnings", function(limit) {
  return Learnings.find({}, {limit: limit, createdAt: 1});
});

Meteor.publish("ownLearnings", function(limit) {
  return Learnings.find({owner: this.userId}, {sort: {timestamp: -1}, limit: limit});
});

Meteor.publish("hangouts", function() {
  return Hangouts.find();
});

Meteor.publish("hangoutsCreated", function(limit) {
  return Hangouts.find({user_id: this.userId}, {sort: {timestamp: -1}, limit: limit});
});

Meteor.publish("hangoutsJoined", function(limit) {
  return Hangouts.find({users:{$elemMatch:{$eq:this.userId}}}, {sort: {timestamp: -1}, limit: limit});
});

Meteor.publish("hangoutSearchResult", function(serchTerm) {
  check(serchTerm, String);
  if (_.isEmpty(serchTerm))
  {
    return this.ready();
  }
  return Hangouts.search(serchTerm);
});
