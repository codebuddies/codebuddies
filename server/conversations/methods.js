/**
 * get conversation id, or create one.
 * @function
 * @name conversation.getId
 * @param {Object} data object
 * @return { String } conversation id
 */
Meteor.methods({
  "conversation.getId"(data) {
    check(data, {
      userId: String
    });

    if (!this.userId) {
      throw new Meteor.Error("unauthorized", "Unauthorized");
    }

    const actor = Meteor.user();

    // find if already exists.
    const convo = Conversations.findOne({
      participants: {
        $all: [{ $elemMatch: { id: data.userId } }, { $elemMatch: { id: actor._id } }]
      }
    });

    // return conversation `_id` if found.
    if (convo) {
      return convo._id;
    }

    // create new conversation if not found.
    const user = Meteor.users.findOne({ _id: data.userId });
    const last_seen = {
      [actor._id]: new Date(),
      [user._id]: new Date()
    };

    const conversation = {
      participants: [
        {
          id: actor._id,
          username: actor.username
        },
        {
          id: user._id,
          username: user.username
        }
      ],
      read_by: [actor._id, user._id],
      last_seen: last_seen,
      private: true
    };
    // create a new conversation
    // & return `_id`;
    return Conversations.insert(conversation);
  }
});

Meteor.methods({
  "conversation.markAsRead"(conversationId) {
    check(conversationId, String);

    const property = `last_seen.${this.userId}`;

    Conversations.update(
      { _id: conversationId, "participants.id": this.userId },
      {
        $addToSet: {
          read_by: this.userId
        },
        $set: {
          [property]: new Date()
        }
      }
    );
  }
});
