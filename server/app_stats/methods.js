
Meteor.methods({
  joinParticipant: function(room) {
    check(room, String);
    AppStats.upsert({
      hangout_id: room
    },
    {
      $setOnInsert: {
        participants_count: 0
      },
      $inc: {
        participants_count: 1
      }
    });
  }
});

Meteor.methods({
  leaveParticipant: function(room) {
    check(room, String);
    // Decrement count when participant count is positive
    AppStats.upsert({ $and: [
      { hangout_id: room },
      { participants_count: { $gt: 0 } }
    ]},
    {
      $inc: {
        participants_count: -1
      }
    });
  }
});
