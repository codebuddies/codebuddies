Meteor.publish( 'resourcesByStudyGroup', function(studyGroupId) {
  if(!studyGroupId){
    return this.ready();
  }

  return Resources.find( { 'study_group.id' : studyGroupId });

});
