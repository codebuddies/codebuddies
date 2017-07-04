Meteor.publish("allStudyGroupActivities", function (limit, studyGroupId) {
  check(limit, Number);
  check(studyGroupId, String);


  return Activities.find({'study_group.id': studyGroupId },{sort: {created_at: -1}},{limit:limit});

  // if we decide to only publish to members
  // if (Roles.userIsInRole(this.userId, ["owner","admin", 'moderator', 'member'], studyGroupId)) {
  //   return Activities.find({'study_group.id': studyGroupId },{sort: {created_at: -1}},{limit:limit});
  // }
  // this.ready();

});
