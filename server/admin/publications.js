Meteor.publish("allNotifications", function (limit) {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"], 'CB')) {
    return Notifications.find({},{sort: {createdAt: -1}},{limit:limit});
  }

  this.ready();
});
