Meteor.publish("studyGroupDiscussions", function(studyGroupId, limit, discussionFilter){
  check(studyGroupId, String);
  check(limit, Number);
  check(discussionFilter, String);

  // query
  let query = new Object();
  query['visibility'] = {$ne:false};
  query['study_group.id'] = studyGroupId;

  // projection
  let projection = new Object();
  projection.fields = {"topic" : 1, 'description':1, "views" : 1, "up_votes" : 1, "down_votes" : 1, "response_count":1, "created_at":1 ,'study_group':1, 'modified_at':1, 'author': 1 };
  projection.limit = limit;

  // options
  var options = new Object();
  options.reactive=false;

  switch (discussionFilter) {
    case 'newest':
      projection.sort = {'created_at' : -1};
      break;
    case 'oldest':
      projection.sort = {'created_at' : 1};
      break;
    case 'most-commented':
      projection.sort = {'response_count' : -1};
      break;
    case 'least-commented':
      projection.sort = {'response_count' : 1};
      break;
    default:
      projection.sort = {'created_at' : 1};
  }

  return Discussions.find(query, projection, options);

});

Meteor.publish("discussionById", function(discussionId){
  check(discussionId, String);

  return Discussions.find({"_id": discussionId });

});
