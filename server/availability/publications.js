Meteor.publish("allStudyGroupAvailability", function (studyGroupId) {
  check(studyGroupId, String);

  if(this.userId) {
   return Availabilities.find({'study_group.id': studyGroupId },{sort: {created_at: 1}});
  }

  this.ready();

});
