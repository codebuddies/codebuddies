import LearningHelper from "./helpers";

Meteor.methods({
  addLearning: function(data) {
    check(data, {
      title: String,
      user_id: String,
      username: String,
      hangout_id: Match.Optional(String),
      study_group_id: Match.Optional(String),
      optInTweet: Match.Optional(Boolean)
    });

    if (!this.userId) {
      throw new Meteor.Error("Learnings.methods.addLearning.not-logged-in", "Must be logged in to add new learning.");
    }

    LearningHelper.addLearning(data);
    return true;
  },

  deleteLearning: function(learningId) {
    check(learningId, String);
    if (!this.userId) {
      throw new Meteor.Error(
        "Learnings.methods.deleteLearning.not-logged-in",
        "Must be logged in to delete a learning."
      );
    }
    Learnings.remove({ _id: learningId, userId: this.userId });
    return true;
  },
  editLearning: function(data) {
    check(data.learningId, String);
    check(data.title, String);

    if (!this.userId) {
      throw new Meteor.Error("Learnings.methods.editLearning.not-logged-in", "Must be logged in to edit the learning.");
    }
    Learnings.update({ _id: data.learningId, userId: this.userId }, { $set: { title: data.title } });
    return true;
  },

  incrementKudoCount: function(learningItemId) {
    check(learningItemId, String);

    if (!this.userId) {
      throw new Meteor.Error(
        "Learnings.methods.incrementKudoCount.not-logged-in",
        "Must be logged in to upvote the learning."
      );
    }
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: 1 },
        $push: { hasLiked: this.userId }
      }
    );
  },

  decrementKudoCount: function(learningItemId) {
    check(learningItemId, String);
    if (!this.userId) {
      throw new Meteor.Error(
        "Learnings.methods.incrementKudoCount.not-logged-in",
        "Must be logged in to upvote the learning."
      );
    }
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: -1 },
        $pull: { hasLiked: this.userId }
      }
    );
    return true;
  }
});

Meteor.methods({
  removeLearnings: function(userId) {
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error(
        "Learnings.methods.removeLearnings.not-logged-in",
        "Must be logged in to Remove Learnings."
      );
    }

    return Learnings.update({ hostId: userId }, { $set: { visibility: false } }, { multi: true });
  }
});

/**
 * Get Total number of learnings.
 * @function
 * @name getTotalNumberOfLearnings
 * @return { Number } learning count
 */
Meteor.methods({
  getTotalNumberOfLearnings() {
    return Learnings.find().count();
  }
});
