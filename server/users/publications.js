Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});
Meteor.publish("allUsers", function () {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"])) {
    return Meteor.users.find({}, {fields: {'createdAt':1, email: 1, profile: 1, roles: 1, username: 1, status: 1}});
  }

  return this.ready();
});
