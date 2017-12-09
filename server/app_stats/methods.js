
Meteor.methods({
  joinParticipant: function(hangoutId) {
    check(hangoutId, String);

    const actor = Meteor.user()
    if (!actor) {
      throw new Meteor.Error(403, "Access denied")
    }

    const participant = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    }

    AppStats.upsert({
      _id: hangoutId
    },
    {
      $setOnInsert: {
        hangout_id: hangoutId,
        type: "PARTICIPANT_COUNT"
      },
      $addToSet: {
        participants: {
          $each: [ participant ]
        }
      }
    });
  }
});

Meteor.methods({
  leaveParticipant: function(hangoutId) {
    check(hangoutId, String);

    const actor = Meteor.user()
    if (!actor) {
      throw new Meteor.Error(403, "Access denied")
    }

    // Decrement count when participant count is positive
    AppStats.update({
      _id: hangoutId
    },
    {
      $pull: {
        participants: {
          id : actor._id
        }
      }
    });
  }
});
