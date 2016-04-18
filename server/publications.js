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
Meteor.publish("allUsers", function () {
  var user = Meteor.users.findOne({_id:this.userId});
  if (Roles.userIsInRole(user, ["admin"])) {
    return Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1, user_info: 1}});
  }

  return this.ready();
});
Meteor.publish("allNotifications", function () {
  var user = Meteor.users.findOne({_id:this.userId});
  if (Roles.userIsInRole(user, ["admin"])) {
    return Notifications.find({},{sort: {date_created: -1}});
  }

  return this.ready();
});
