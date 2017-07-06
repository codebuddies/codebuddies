Meteor.publish("archivedUsers", function () {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"], 'CB')) {
    return ArchivedUsers.find({},{sort: {archived_at : -1}});
  }
  this.ready();

});
