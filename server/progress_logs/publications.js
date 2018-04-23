Meteor.publish("progressLogsByStudyGroupId", function(limit, id){
  check(limit, Number);
  check(id, String);

  let query = new Object();
  query['study_group.id'] = id;
  query.visibility = {$ne:false};

  let projection = new Object();

  projection.fields = {"title" : 1, author: 1, study_group: 1, created_at: 1 };

  let options = new Object();
  options.reactive=false;
  options.limit = limit;
  options.sort = {
    created_at: -1
  }

  return ProgressLogs.find(query, projection, options);

});

Meteor.publish("progressLogsById", function(id){
  check(id, String);

  return ProgressLogs.find({_id:id, visibility:{$ne:false} });

});
