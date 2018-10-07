Meteor.methods({
  joinParticipant: function(hangoutId) {
    check(hangoutId, String);

    // for guest user.
    const guestUser = {
      _id: "guest",
      username: "guest",
      profile: {
        avatar: {
          default: "https://codebuddies.org/images/logo-circle.svg"
        }
      }
    };
    const actor = Meteor.user() || guestUser;
    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const participant = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };

    AppStats.upsert(
      {
        _id: hangoutId
      },
      {
        $setOnInsert: {
          hangout_id: hangoutId,
          type: "PARTICIPANT_COUNT"
        },
        $addToSet: {
          participants: {
            $each: [participant]
          }
        }
      }
    );

    if (hangoutId == "cbcoworking") {
      coworkingSlackAlert(participant.username);
    }
  }
});

Meteor.methods({
  leaveParticipant: function(hangoutId) {
    check(hangoutId, String);

    // for guest user
    const actor = Meteor.user() || { _id: "guest" };
    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    // Decrement count when participant count is positive
    AppStats.update(
      {
        _id: hangoutId
      },
      {
        $pull: {
          participants: {
            id: actor._id
          }
        }
      }
    );
  }
});
