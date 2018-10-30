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
      "participants.id": data.userId,
      "participants.id": actor._id,
      private: true
    });

    // return conversation `_id` if found.
    if (convo) {
      return convo._id;
    }

    // create new conversation if not found.
    const user = Meteor.users.findOne({ _id: data.userId });
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

    Conversations.update(
      { _id: conversationId, "participants.id": this.userId },
      {
        $addToSet: { read_by: this.userId }
      }
    );
  }
});
