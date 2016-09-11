Meteor.publish("archivedUsers", function () {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"])) {
    return ArchivedUsers.find({},{sort: {archived_at : -1}});
  }
  this.ready();

});
