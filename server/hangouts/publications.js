Meteor.publish("hangouts", function(limit) {
  check(limit, Number);

  if (Roles.userIsInRole(this.userId, ['admin','moderator'], 'CB')) {
    return Hangouts.find({}, {fields:{'email_addresses': 0 }, sort: { start: -1 }, 'limit':limit});
  } else {
    return Hangouts.find({'visibility':{$ne:false}}, {fields:{'email_addresses': 0 }, sort: { start: -1 }, 'limit':limit});
  }

  this.ready();
});



Meteor.publish("hangoutById", function(hangoutId) {
  if (Roles.userIsInRole(this.userId, ['admin','moderator'], 'CB')) {
    return Hangouts.find({_id: hangoutId},
                         {fields:{'email_addresses': 0 }});
  } else {
    return Hangouts.find({_id: hangoutId, 'visibility':{ $ne: false} },
                         {fields: {'email_addresses': 0 }} );
  }
});


Meteor.publish("hangoutsJoined", function(limit, userId) {
  check(limit, Number);
  check(userId, String);

  if(this.userId) {
    return Hangouts.find({users:{ $elemMatch:{ $eq: userId}},'visibility':{ $ne: false}},
                         {sort: {timestamp: -1}, limit: limit});
  } else {
   this.ready();
  }

});



Meteor.publish("hangoutBoard", function(limit, hangoutFilter) {
  check(limit, Number);
  check(hangoutFilter, String);

  var query = new Object();
  query.visibility = {$ne:false};

  var projection = new Object();
  projection.sort = {'start' : 1};
  projection.fields = {"topic" : 1, 'host':1, "views" : 1, "users" : 1, "slug" : 1, "start":1, "end":1 ,'type':1, 'group':1 };
  projection.limit = limit;

  var options = new Object();
  options.reactive=false;

  switch (hangoutFilter) {
    case 'live':
      query.start = {'$lte' : new Date()};
      query.end = {'$gte' : new Date()};

      break;
    case 'upcoming':
      query.start = {$gte : new Date()};

      break;
    default:
  }

  return Hangouts.find(query, projection, options);

});

Meteor.publish("studyGroupHangouts", function(groupId, limit) {
  check(groupId, String);
  return Hangouts.find({ visibility: {$ne:false}, 'group.id': groupId}, {sort: {start: -1}, limit:limit});
});

Meteor.publish( 'hangoutSearch', function(searchTerm) {
  check(searchTerm, String);
    if (_.isEmpty(searchTerm))
    return this.ready();

    return Hangouts.search(searchTerm);
});
