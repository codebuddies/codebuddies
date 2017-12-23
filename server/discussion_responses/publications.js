Meteor.publish("responsesByDiscussionId", function(discussionId){
  check(discussionId, String);
  return DiscussionResponses.find({'discussion_id': discussionId}, {sort:{ created_at: -1}})

});
