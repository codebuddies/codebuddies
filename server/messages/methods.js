import _ from "lodash";

/**
 * add message
 * @function
 * @name message.add
 * @param {Object} data object
 * @return { Boolean }
 */
Meteor.methods({
  "message.add"(data) {
    check(data, {
      conversationId: String,
      body: String,
      body_delta: String
    });

    if (!this.userId) {
      throw new Meteor.Error("unauthorized", "Unauthorized");
    }
    const conversation = Conversations.findOne({ _id: data.conversationId });
    const { participants } = conversation;

    const actor = Meteor.user();

    // get reciever info
    const to = _.reject(participants, { id: actor._id })[0];
    // get sender info
    const from = { id: actor._id, username: actor.username };

    const message = {
      conversation_id: data.conversationId,
      to,
      from,
      body: data.body,
      body_delta: data.body_delta,
      sent: new Date()
    };

    // set `read_by`.
    // set `sent` to last message time.
    // set `email_notifications.initial` flag to `false`.
    Conversations.update(
      { _id: data.conversationId },
      {
        $set: {
          read_by: [actor._id],
          sent: new Date(),
          email_notifications: {
            initial: false
          }
        }
      }
    );

    // add message
    return Messages.insert(message);
  }
});

/**
 * report message
 * @function
 * @name messages.report
 * @param { Object } data - Data
 * @return Boolean
 */
Meteor.methods({
  "messages.report": function(data) {
    check(data, {
      messageId: String,
      category: String
    });

    const actor = Meteor.user();
    const message = Messages.findOne({ _id: data.messageId });
    const { from: author } = message;
    if (!actor) {
      throw new Meteor.Error(500, "You are trying do something fishy.");
    }

    const matter = " as " + data.category + ".";

    const notification = {
      actor: {
        id: actor._id,
        username: actor.username
      },
      subject: {
        id: author.id,
        username: author.username
      },
      message: message,
      createdAt: new Date(),
      read: [actor._id],
      action: "reported",
      matter: matter,
      icon: "fa-exclamation-circle",
      type: "reported message"
    };
    Notifications.insert(notification);
    return true;
  }
});
