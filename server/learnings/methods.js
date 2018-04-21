import {tweetLearning} from '../twitter/methods.js';

Meteor.methods({
  addLearning: function(data) {
    check(data, {
      title: String,
      user_id: String,
      username: String,
      hangout_id: Match.Optional(String),
      study_group_id: Match.Optional(String),
      optOutTweet: Match.Optional(Boolean)
    })


    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.addLearning.not-logged-in', 'Must be logged in to add new learning.');
    }

    const learning = {
      title: data.title,
      userId: data.user_id,
      username: data.username,
      created_at: new Date(),
      hangout_id: data.hangout_id,
      study_group_id: data.study_group_id,
      kudos: 0
    }


    try {
      Learnings.insert(learning);

      //tweet user learning
      if (data.optOutTweet === false) {
        tweetLearning(learning);
      }
      return true;
    } catch (e) {
      console.log('learning error', e.toString());
    }

  },

  deleteLearning: function(learningId) {
    check(learningId, String);
    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.deleteLearning.not-logged-in', 'Must be logged in to delete a learning.');
    }
    Learnings.remove( { _id: learningId, userId: this.userId } );
    return true;
  },
  editLearning: function(data) {
    check(data.learningId, String);
    check(data.title, String);

    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.editLearning.not-logged-in', 'Must be logged in to edit the learning.');
    }
    Learnings.update({_id: data.learningId, userId: this.userId },
                     {$set: {title: data.title} });
    return true;
  },

  incrementKudoCount: function(learningItemId) {
    check(learningItemId, String);

    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.incrementKudoCount.not-logged-in', 'Must be logged in to upvote the learning.');
    }
    Learnings.update({_id: learningItemId },
                     {$inc: { kudos: 1 },
                      $push: { hasLiked: this.userId } });
  },

  decrementKudoCount: function(learningItemId) {
    check(learningItemId, String);
    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.incrementKudoCount.not-logged-in', 'Must be logged in to upvote the learning.');
    }
    Learnings.update({_id: learningItemId },
                     {$inc: { kudos: -1 },
                      $pull: { hasLiked: this.userId } });
    return true;
  }
});


Meteor.methods({
  removeLearnings:function(userId){
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error('Learnings.methods.removeLearnings.not-logged-in', 'Must be logged in to Remove Learnings.');
    }

    return Learnings.update({'hostId': userId},
                           {$set: {visibility: false}},
                           {multi: true});



  }
});
