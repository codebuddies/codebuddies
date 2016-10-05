Meteor.publish("hangouts", function(limit) {
  check(limit, Number);

  if(this.userId) {
    if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {
      return Hangouts.find({}, {fields:{'email_addresses': 0 }, sort: { start: -1 }, 'limit':limit});
    } else {
      return Hangouts.find({'visibility':{$ne:false}}, {fields:{'email_addresses': 0 }, sort: { start: -1 }, 'limit':limit});
    }
  } else {
   this.ready();
  }

});

Meteor.publish("hangoutById", function(hangoutId) {

  if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {

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

Meteor.publish("hangoutSearchResult", function(serchTerm) {

  check(serchTerm, String);
  if (_.isEmpty(serchTerm)){
    this.ready();
  }
  return Hangouts.search(serchTerm);
});

Meteor.publish("hangoutBoard", function(limit, hangoutFilter) {
  check(limit, Number);
  check(hangoutFilter, String);

  var query = new Object();
  var sortOrder = new Object();
  query.visibility = {$ne:false};
  switch (hangoutFilter) {
    case 'live':
        query.start = {'$lte' : new Date()};
        query.end = {'$gte' : new Date()};
        sortOrder.sort = {'start' : -1}
      break;
    case 'upcoming':
      query.start = {$gte : new Date()};
      sortOrder.sort = {'start' : -1}
      break;
    default:

  }
  // console.log(query);
  // console.log(sortOrder);


  return Hangouts.find(query, sortOrder);


  //return Hangouts.find(query, {fields:{'email_addresses': 0 }, sortOrder, 'limit':limit});


});
