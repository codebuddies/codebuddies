Meteor.publish("hangouts", function() {

  if(this.userId) {
    if (Roles.userIsInRole(this.userId, ['admin','moderator'])) {
      return Hangouts.find({}, {fields:{'email_addresses': 0 }});
    } else {
      return Hangouts.find({'visibility':{$ne:false}}, {fields:{'email_addresses': 0 }});
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


Meteor.publish("hangoutsJoined", function(limit) {

  if(this.userId) {
    return Hangouts.find({users:{ $elemMatch:{ $eq: this.userId}},'visibility':{ $ne: false}},
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
