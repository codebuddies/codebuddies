Meteor.methods({
  addComments:function(comment){
    if (!this.userId) {
      throw new Meteor.Error('Comments.methods.addComments.not-logged-in', 'Must be logged in to add new comment.');
    }
    comment.posted = new Date();
    return Comments.insert(comment);
  }
});

Meteor.methods({
  upVoteComment:function(commentId){
    check(commentId, String);
    if (!this.userId) {
      throw new Meteor.Error('Comments.methods.upVoteComment.not-logged-in', 'Must be logged in to upvote a comment.');
    }
    Comments.update(
      { _id: commentId },
      {
        $push: { upvotes: this.userId }
      }
    );
  }
});

Meteor.methods({
  downVoteComment:function(commentId){
    check(commentId, String);
    if (!this.userId) {
      throw new Meteor.Error('Comments.methods.downVoteComment.not-logged-in', 'Must be logged in to downvote a comment.');
    }
    Comments.update(
      { _id: commentId },
      {
        $push: { downvotes: this.userId }
      }
    );
  }
});

Meteor.methods({
  voteSwitching:function(commentId,trigger){
    check(commentId, String);
    check(trigger, String);
    if (!this.userId) {
      throw new Meteor.Error('Comments.methods.upVoteComment.not-logged-in', 'Must be logged in to upvote a comment.');
    }
      switch (trigger) {
        case "upvote-to-downvote":
              Comments.update(
                { _id: commentId },
                {
                  $pull: { upvotes: this.userId },
                  $push: { downvotes: this.userId }
                }
              );
          break;
        case "downvote-to-upvote":
              Comments.update(
                { _id: commentId },
                {
                  $pull: { downvotes: this.userId },
                  $push: { upvotes: this.userId }
                }
              );
          break;

      }

  }
});

Meteor.methods({
  deleteComments:function(data){
    check(data.commentId, String);
    check(data.authorId, String);
    check(data.slug, String);
    check(data.discussionId, String);
    var userId = this.userId;
    var modifiedAt = new Date();

    const comment = Comments.findOne({_id : data.commentId});

    if (!userId === comment.authorId) {
      throw new Meteor.Error('Comments.remove.accessDenied','Cannot remove comments');
    }

     Comments.update({$and:[{_id:data.commentId},{authorId:data.authorId},{discussionId:data.discussionId},{slug:{$regex:data.slug}}]},
       {$set:{visibility: false, modifiedAt:modifiedAt, modifiedBy:userId}},
       {multi:true});
  }
});
