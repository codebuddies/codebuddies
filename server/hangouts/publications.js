Meteor.publish("hangouts", function(limit) {
  check(limit, Number);

  if (Roles.userIsInRole(this.userId, ["admin", "moderator"], "CB")) {
    return Hangouts.find(
      {},
      { fields: { email_addresses: 0 }, sort: { start: -1 }, limit: limit }
    );
  } else {
    return Hangouts.find(
      { visibility: { $ne: false } },
      { fields: { email_addresses: 0 }, sort: { start: -1 }, limit: limit }
    );
  }

  this.ready();
});

Meteor.publish("hangoutById", function(hangoutId) {
  if (Roles.userIsInRole(this.userId, ["admin", "moderator"], "CB")) {
    return Hangouts.find(
      { _id: hangoutId },
      { fields: { email_addresses: 0 } }
    );
  } else {
    return Hangouts.find(
      { _id: hangoutId, visibility: { $ne: false } },
      { fields: { email_addresses: 0 } }
    );
  }
});

Meteor.publish("hangoutsJoined", function(limit, userId) {
  check(limit, Number);
  check(userId, String);

  if (this.userId) {
    return Hangouts.find(
      { users: { $elemMatch: { $eq: userId } }, visibility: { $ne: false } },
      { sort: { timestamp: -1 }, limit: limit }
    );
  } else {
    this.ready();
  }
});

Meteor.publish("studyGroupHangouts", function(groupId, limit) {
  check(groupId, String);
  return Hangouts.find(
    { visibility: { $ne: false }, "group.id": groupId },
    { sort: { start: -1 }, limit: limit }
  );
});

Meteor.publish("hangoutSearch", function(searchTerm) {
  check(searchTerm, String);
  if (_.isEmpty(searchTerm)) return this.ready();

  return Hangouts.search(searchTerm);
});
