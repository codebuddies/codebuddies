Meteor.publish("learnings", function(limit) {

  return Learnings.find({},
                        {sort: {created_at: -1}, limit: limit});
});

Meteor.publish("ownLearnings", function(limit) {

  return Learnings.find({userId: this.userId},
                        {sort: {created_at: -1}, limit: limit});
});
