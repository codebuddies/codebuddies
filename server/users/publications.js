Meteor.publish("userStatus", function() {

  if(this.userId){
    return Meteor.users.find({ "status.online": true });
  }else{
    this.ready();
  }

});
Meteor.publish("allUsers", function () {

  if (Roles.userIsInRole(this.userId, ["admin","moderator"], 'CB')) {
    return Meteor.users.find({}, {fields: {'createdAt':1, email: 1, profile: 1, roles: 1, username: 1, status: 1}});
  }
  this.ready();

});
