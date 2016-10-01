Meteor.publish('comments', function(hangoutId) {
  return Comments.find({discussionId:hangoutId, visibility:{$ne:false}});
});
