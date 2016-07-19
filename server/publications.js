Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});

Meteor.publish("learnings", function(limit) {
  return Learnings.find({}, {limit: limit, createdAt: 1});
});

Meteor.publish("ownLearnings", function(limit) {
  return Learnings.find({userId: this.userId}, {sort: {timestamp: -1}, limit: limit});
});

Meteor.publish("hangouts", function() {
  if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {

    return Hangouts.find({}, {fields:{'email_addresses': 0 }});

  } else {

    return Hangouts.find({'visibility':{$ne:false}}, {fields:{'email_addresses': 0 }});

  }

});
Meteor.publish("hangoutById", function(hangoutId) {
  if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {

    return Hangouts.find({_id: hangoutId}, {fields:{'email_addresses': 0 }});

  } else {

    return Hangouts.find({_id: hangoutId, 'visibility':{$ne:false}}, {fields:{'email_addresses': 0 }} );

  }

});

Meteor.publish("hangoutsCreated", function(limit) {
  return Hangouts.find({user_id: this.userId,'visibility':{$ne:false}}, {sort: {timestamp: -1}, limit: limit});
});

Meteor.publish("hangoutsJoined", function(limit) {
  return Hangouts.find({users:{$elemMatch:{$eq:this.userId}},'visibility':{$ne:false}}, {sort: {timestamp: -1}, limit: limit});
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

  if (Roles.userIsInRole(this.userId, ["admin","moderator"])) {
    return Meteor.users.find({}, {fields: {'createdAt':1, email: 1, profile: 1, roles: 1, username: 1, status: 1}});
  }

  return this.ready();
});
Meteor.publish("allNotifications", function (limit) {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"])) {
    return Notifications.find({},{sort: {createdAt: -1}},{limit:limit});
  }

  return this.ready();
});
// Meteor.publish(null, function(argument){
//   return Meteor.users.find({_id:this.userId},{fields:{user_info:1}});
// });
Meteor.publish("attendees", function(limit){
  return RSVPnotifications.find({createorId:this.userId},{sort: {date: -1}},{limit:limit});
});
