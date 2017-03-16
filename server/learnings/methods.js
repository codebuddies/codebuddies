import {tweetLearning} from '../twitter/methods.js';

Meteor.methods({
  addLearning: function(data) {
    check(data.title, String);
    check(data.user_id, String);
    check(data.username, String);
    check(data.hangout_id, String)

    if (!this.userId) {
      throw new Meteor.Error('Learnings.methods.addLearning.not-logged-in', 'Must be logged in to add new learning.');
    }

    const learning = {
      title: data.title,
      userId: data.user_id,
      username: data.username,
      created_at: new Date(),
      hangout_id: data.hangout_id,
      kudos: 0
    }
    Learnings.insert(learning);

    //tweet user learning
    tweetLearning(learning);


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
