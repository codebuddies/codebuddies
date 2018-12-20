/**
 * Create new Discussion
 * @function
 * @name discussions.insert
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.insert": function(data) {
    check(data, {
      topic: String,
      description: String,
      groupId: String,
      groupTitle: String,
      groupSlug: String,
      tags: Match.Maybe([String]),
      channel: String
    });

    const actor = Meteor.user();

    if (!actor || !Roles.userIsInRole(actor, ["owner", "admin", "moderator", "member", "user"], data.groupId)) {
      throw new Meteor.Error(403, "Access denied");
    } else {
    }

    // auth

    // data
    const author = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };
    const study_group = {
      id: data.groupId,
      title: data.groupTitle,
      slug: data.groupSlug
    };
    let discussion = {
      topic: data.topic,
      description: data.description,
      tags: data.tags,
      channel: data.channel,
      created_at: new Date(),
      modified_at: null,
      up_votes: [],
      down_votes: [],
      views: 0,
      version: 0,
      response_count: 0,
      visibility: true,
      locked: false,
      subscribers: [author],
      participants: [author],
      author: author,
      study_group: study_group,
      email_notifications: {
        initial: false
      }
    };

    //insert
    discussion._id = Discussions.insert(discussion);

    StudyGroups.update(
      { _id: study_group.id },
      {
        $set: {
          updatedAt: new Date()
        }
      }
    );

    // slack alert
    discussionsSlackAlert(discussion);

    // @todo: notification

    return true;
  }
});

/**
 * Update a Discussion
 * @function
 * @name discussions.update
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.update": function(data) {
    check(data, {
      id: String,
      topic: String,
      description: String,
      tags: Match.Maybe([String])
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const discussion = Discussions.findOne({ _id: data.id });

    if (!discussion) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (discussion.author.id === actor._id) {
      Discussions.update(
        { _id: data.id },
        {
          $set: {
            topic: data.topic,
            description: data.description,
            tags: data.tags,
            modified_at: new Date()
          },
          $inc: { version: 1 }
        }
      );

      return true;
    } else if (Roles.userIsInRole(actor._id, ["admin", "moderator"], "CB")) {
      Discussions.update(
        { _id: data.id },
        {
          $set: {
            topic: data.topic,
            description: data.description,
            tags: data.tags,
            modified_at: new Date()
          },
          $inc: { version: 1 }
        }
      );

      const notification = {
        actor: {
          id: actor._id,
          username: actor.username
        },
        subject: {
          id: discussion.author.id,
          username: discussion.author.username
        },
        discussion: {
          id: discussion._id,
          topic: discussion.topic
        },
        createdAt: new Date(),
        read: [actor._id],
        action: "edited",
        icon: "fa-edit",
        type: "discussion edit"
      };
      Notifications.insert(notification);

      return true;
    } else {
      throw new Meteor.Error(403, "Access denied");
    }
  }
});

/**
 * Upvote a Discussion
 * @function
 * @name discussions.upvote
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.upvote": function(data) {
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

    Discussions.update(
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
 * Downvote a Discussion
 * @function
 * @name discussions.downvote
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.downvote": function(data) {
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

    Discussions.update(
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
 * Remove a Discussion
 * @function
 * @name discussions.remove
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.remove": function(data) {
    check(data, {
      id: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const discussion = Discussions.findOne({ _id: data.id });

    if (!discussion) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (discussion.author.id === actor._id) {
      Discussions.update({ _id: data.id }, { $set: { visibility: false } });

      return true;
    } else if (Roles.userIsInRole(actor._id, ["admin", "moderator"], "CB")) {
      Discussions.update({ _id: data.id }, { $set: { visibility: false } });

      const notification = {
        actor: {
          id: actor._id,
          username: actor.username
        },
        subject: {
          id: discussion.author.id,
          username: discussion.author.username
        },
        discussion: {
          id: discussion._id,
          topic: discussion.topic
        },
        createdAt: new Date(),
        read: [actor._id],
        action: "deleted",
        icon: "fa-trash-alt",
        type: "discussion delete"
      };
      Notifications.insert(notification);

      return true;
    } else {
      throw new Meteor.Error(403, "Access denied");
    }

    return true;
  }
});

/**
 * increment view count
 * @function
 * @name discussions.incViewCount
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.incViewCount": function(id) {
    check(id, String);

    Discussions.update({ _id: id }, { $inc: { views: 1 } });

    return true;
  }
});

/**
 * subscribe
 * @function
 * @name discussions.subscribe
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.subscribe": function(data) {
    check(data, {
      id: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const subscriber = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default
    };

    Discussions.update(
      { _id: data.id },
      {
        $addToSet: {
          subscribers: subscriber
        }
      }
    );

    return true;
  }
});
/**
 * unsubscribe
 * @function
 * @name discussions.unsubscribe
 * @param { Object } data - Data
 * @return {Boolean} true on success
 */
Meteor.methods({
  "discussions.unsubscribe": function(data) {
    check(data, {
      id: String
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    Discussions.update(
      { _id: data.id },
      {
        $pull: {
          subscribers: { id: actor._id }
        }
      }
    );

    return true;
  }
});

/**
 * get topics for sidebar
 * @function
 * @name discussions.getTopics
 * @param { Object } data - Data
 * @return {cursor}
 */
Meteor.methods({
  "discussions.getTopics": function(data) {
    check(data, {
      type: String,
      id: String
    });

    let query = new Object();
    query["visibility"] = { $ne: false };
    query["_id"] = { $ne: data.id };

    let options = new Object();
    options.reactive = false;

    let projection = new Object();
    projection.fields = { topic: 1 };
    projection.limit = 5;
    projection.sort = { created_at: 1 };

    let maybe = [];

    switch (data.type) {
      case "active":
        const actor = Meteor.user();
        if (actor) {
          maybe.push({ "author.id": actor._id });
          maybe.push({ "participants.id": actor._id });
          query["$or"] = maybe;
        }
        break;
      case "recent":
        break;
      default:
    }

    // console.log(query);

    return Discussions.find(query, projection, options).fetch();
  }
});

/**
 * report discussion
 * @function
 * @name discussions.report
 * @param { Object } data - Data
 * @return Boolean
 */
Meteor.methods({
  "discussions.report": function(data) {
    check(data, {
      discussionId: String,
      discussionTopic: String,
      category: String,
      reporterId: String
    });

    const actor = Meteor.user();
    const author = Discussions.findOne({ _id: data.discussionId }).author;
    if (data.reporterId !== actor._id) {
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
      discussion: {
        id: data.discussionId,
        topic: data.discussionTopic
      },
      createdAt: new Date(),
      read: [actor._id],
      action: "reported",
      matter: matter,
      icon: "fa-exclamation-circle",
      type: "reported discussion"
    };

    Notifications.insert(notification);
    return true;
  }
});

Meteor.methods({
  "discussions.archive": function(userId) {
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error(
        "Discussion.methods.removeDiscussions.not-logged-in",
        "Must be logged in to Remove Discussions."
      );
    }

    return Discussions.update({ "author.id": userId }, { $set: { visibility: false } }, { multi: true });
  }
});
