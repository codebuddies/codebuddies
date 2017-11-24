Meteor.publish('hangoutParticipants', function(room) {
  check(room, String);
  if (room) {
      return AppStats.find({ hangout_id: room });
  }
  return this.ready();
});

Meteor.publish('allHangoutParticipants', function(hangoutRoomIds) {
  check(hangoutRoomIds, Match.Maybe([String]));
  if (hangoutRoomIds == null || typeof hangoutRoomIds === 'undefined' ||
    !Array.isArray(hangoutRoomIds) || hangoutRoomIds.length === 0) {
    return this.ready();
  }
  return AppStats.find({hangout_id: { $in: hangoutRoomIds } });
});
