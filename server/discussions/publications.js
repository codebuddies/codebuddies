Meteor.publish("studyGroupDiscussions", function(studyGroupId, limit){
  check(studyGroupId, String);
  check(limit, Number);

  return Discussions.find({ visibility: {$ne:false}, 'study_group.id': studyGroupId}, {sort: {created_at: -1}, limit:limit});

});
