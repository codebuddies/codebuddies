Meteor.publish('hangoutParticipants', function(hangoutId) {
  check(hangoutId, String);
  if (hangoutId) {
    return AppStats.find({ _id: hangoutId });
  }
  this.ready();
});

Meteor.publish('allHangoutParticipants', function(hangoutIds) {
  check(hangoutIds, Match.Maybe([String]));

  if (hangoutIds && hangoutIds.length > 0 ){
    return AppStats.find({_id: { $in: hangoutIds } });
  }
  this.ready();

});
