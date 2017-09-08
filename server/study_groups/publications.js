Meteor.publish( 'myStudyGroups', function(limit) {
  if (!this.userId) {
    return this.ready();
  }
  //console.log(this.userId);
  let roles = Meteor.users.findOne({_id : this.userId}).roles;
  let studyGroups = [];
  for (let key in roles) {
    studyGroups.push(key)
  }

  let query = new Object();
  query._id = { $in : studyGroups};
  query.visibility = {$ne:false};

  let projection = new Object();

  projection.fields = {"title" : 1, 'tagline':1, "slug" : 1, members: 1 };
  projection.limit = limit;

  let options = new Object();
  options.reactive=false;

  // console.log(StudyGroups.find({ _id : { $in : studyGroups}}).count());
  return StudyGroups.find(query, projection, options);
});


Meteor.publish( 'allStudyGroups', function(limit, studyGroupsFilter) {
  check(limit, Number);
  check(studyGroupsFilter, String);

  let query = new Object();
  query.visibility = {$ne:false};

  let projection = new Object();

  projection.fields = {"title" : 1, 'tagline':1, "slug" : 1, members: 1 };
  projection.limit = limit;

  let options = new Object();
  options.reactive=false;

  switch (studyGroupsFilter) {
    case 'new':
      projection.sort = {'createdAt' : 1};

      break;
    case 'popular':


      break;
    default:
  }

  return StudyGroups.find(query, projection, options);
});


Meteor.publish( 'studyGroupById', function(studygroupId) {
  check(studygroupId, String);

  return StudyGroups.find({ _id : studygroupId});
});
