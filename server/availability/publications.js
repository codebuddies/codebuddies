Meteor.publish("allStudyGroupAvailability", function (studyGroupId) {
  check(studyGroupId, String);

  if(this.userId) {
    return Availabilities.find({'study_group.id': studyGroupId },{sort: {created_at: -1}});
  }

  this.ready();

  // if we decide to only publish to members
  // if (Roles.userIsInRole(this.userId, ["owner","admin", 'moderator', 'member'], studyGroupId)) {
  //   return Availabilities.find({'study_group.id': studyGroupId },{sort: {created_at: -1}},{limit:limit});
  // }
  // this.ready();

});
