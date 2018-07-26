/**
 * Add new Response
 * @function
 * @name discussionResponse.insert
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussionResponses.insert": function(data) {
    check(data, {
      discussion_id: String,
      parent_id: String,
      text: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    } else {
    }

    const author = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };

    const discussionResponse = {
      discussion_id: data.discussion_id,
      parent_id: data.parent_id,
      text: data.text,
      author: author,
      created_at: new Date(),
      modified_at: null,
      visibility: true,
      version: 0,
      up_votes: [],
      down_votes: [],
      email_notifications: {
        initial: false
      }
    };

    const response_id = DiscussionResponses.insert(discussionResponse);

    if (response_id) {
      Discussions.update(
        { _id: data.discussion_id },
        {
          $addToSet: {
            subscribers: author,
            participants: author
          },
          $inc: {
            response_count: 1
          }
        }
      );
    }

    // @todo : notify the participants/subscribers

    return true;
  }
});

/**
 * Update Response
 * @function
 * @name discussionResponse.update
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussionResponses.update": function(data) {
    check(data, {
      id: String,
      text: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    } else {
    }

    const discussionResponse = DiscussionResponses.findOne({
      _id: data.id,
      "author.id": actor._id
    });

    if (!discussionResponse) {
      throw new Meteor.Error(403, "Access denied");
    }

    DiscussionResponses.update(
      { _id: data.id },
      {
        $set: {
          text: data.text,
          modified_at: new Date()
        },
        $inc: { version: 1 }
      }
    );

    return true;
  }
});

/**
 * Upvote a Discussion Response
 * @function
 * @name discussionResponses.upvote
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussionResponses.upvote": function(data) {
    check(data, {
      id: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const voter = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };

    DiscussionResponses.update(
      { _id: data.id },
      {
        $addToSet: {
          up_votes: voter
        },
        $pull: {
          down_votes: { id: voter.id }
        }
      }
    );

    return true;
  }
});

/**
 * Downvote a Discussion Response
 * @function
 * @name discussionResponses.downvote
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussionResponses.downvote": function(data) {
    check(data, {
      id: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const voter = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };

    DiscussionResponses.update(
      { _id: data.id },
      {
        $addToSet: {
          down_votes: voter
        },
        $pull: {
          up_votes: { id: voter.id }
        }
      }
    );

    return true;
  }
});

/**
 * Remove a Discussion Responses
 * @function
 * @name discussionResponses.remove
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussionResponses.remove": function(data) {
    check(data, {
      id: String
    });

    DiscussionResponses.update(
      { _id: data.id },
      { $set: { visibility: false } }
    );

    return true;
  }
});

Meteor.methods({
  "discussionResponses.archive": function(userId) {
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error(
        "DiscussionResponse.methods.removeDiscussionResponses.not-logged-in",
        "Must be logged in to Remove Discussion Responses."
      );
    }

    return DiscussionResponses.update(
      { "author.id": userId },
      { $set: { visibility: false } },
      { multi: true }
    );
  }
});
