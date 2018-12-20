import _ from "lodash";

Template.commentBox.onCreated(function() {
  this.autorun(() => {
    this.subscribe("comments", FlowRouter.getParam("hangoutId"));
    Session.setDefault("replyToComment", []);
  });
});

Template.commentBox.onRendered(function() {
  if (Session.get("commentFilter") !== undefined) {
    $("#commentFilter").val(Session.get("commentFilter"));
  } else {
    Session.setDefault("commentFilter", 1);
  }
});
Template.commentBox.helpers({
  comments: function() {
    FlowRouter.watchPathChange();

    var query = new Object();
    var sortOrder = new Object();

    query.discussionId = FlowRouter.getParam("hangoutId");
    query.visibility = { $ne: false };

    if (Session.get("commentFilter") !== undefined) {
      switch (Session.get("commentFilter")) {
        case "1":
          sortOrder.sort = { posted: -1 };
          break;
        case "2":
          sortOrder.sort = { "upvotes.length": -1 };
          break;
        case "3":
          sortOrder.sort = { "upvotes.length": -1, posted: -1 };
          break;
        default:
      }
    }

    //var comments = Comments.find({discussionId:FlowRouter.getParam('hangoutId'), visibility:{$ne:false}},{sort:{posted : -1}}).fetch();
    var comments = Comments.find(query, sortOrder).fetch();

    var sortComments = function(comments, parent) {
      var cmnts = [];
      comments
        .filter(function(comment) {
          return comment.parent_id === parent;
        })
        .forEach(function(comment) {
          var t = comment;
          t.child = sortComments(comments, comment._id);
          return cmnts.push(t);
        });
      return cmnts;
    };

    var sortCommentsReplyByDate = function(comments) {
      comments.forEach(function(comment) {
        if (comment.child.length > 0) {
          comment.child = _.sortBy(comment.child, ["posted"]);
          return sortCommentsReplyByDate(comment.child);
        }
      });
      return comments;
    };
    var cmnts = sortComments(comments, null);
    //console.log(JSON.stringify(sortCommentsReplyByDate(cmnts),null,'\t'));
    //console.log(JSON.stringify(sortComments(comments,null),null,'\t'));
    //return sortComments(comments,null);
    return sortCommentsReplyByDate(cmnts);
  }
});

Template.commentBox.events({
  "click .addNewMessage": function(event, template) {
    event.preventDefault();
    if ($.trim($("#newMessage").val()) == "") {
      swal({
        title: TAPi18n.__("Comment can't be empty"),
        // text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "info"
      });
      return;
    }

    var comment = {
      discussionId: FlowRouter.getParam("hangoutId"),
      slug: Random.secret(7),
      authorId: Meteor.userId(),
      authorName: Meteor.user().username,
      authorAvatar: Meteor.user().profile.avatar.default,
      text: $("#newMessage")
        .val()
        .replace(/\r?\n/g, "<br />"),
      parent_id: null
    };

    Meteor.call("addComments", comment, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        template.find("#newMessage").value = "";
      }
    });
  },
  "click .upVote": function(event, template) {
    var userId = Meteor.userId();
    var commentId = this._id;

    //checking if user has already voted for same category
    if (userId && !_.includes(this.upvotes, userId)) {
      //checking if user has already voted for other category if true then switching
      if (userId && _.includes(this.downvotes, userId)) {
        Meteor.call("voteSwitching", commentId, "downvote-to-upvote", function(error, result) {
          if (error) {
            console.log("error", error);
          }
        });
      } else {
        Meteor.call("upVoteComment", commentId, function(error, result) {
          if (error) {
            console.log("error", error);
          }
        });
      } //inner if
    } else {
      alert("already voted");
    }
  },
  "click .downVote": function(event, template) {
    var userId = Meteor.userId();
    var commentId = this._id;

    //checking user status
    // if (userId=== null) {
    //   Modal.show('loginModal');
    // }

    //checking if user has already voted for same category if false
    if (userId && !_.includes(this.downvotes, userId)) {
      //checking if user has already voted for other category if true then switching
      if (userId && _.includes(this.upvotes, userId)) {
        Meteor.call("voteSwitching", commentId, "upvote-to-downvote", function(error, result) {
          if (error) {
            console.log("error", error);
          }
        });
      } else {
        Meteor.call("downVoteComment", commentId, function(error, result) {
          if (error) {
            console.log("error", error);
          }
        });
      } //inner if
    } else {
      alert("already downvoted");
    }
  },
  "click .replyToComment": function(event, template) {
    event.preventDefault();

    var commentId = this._id;
    var replyToComment = Session.get("replyToComment");

    if (_.includes(replyToComment, commentId)) {
      $("#" + commentId + "replyToCommentSection").empty();
      replyToComment = _.pull(replyToComment, commentId);
      console.log(replyToComment);
      Session.set("replyToComment", replyToComment);
    } else {
      replyToComment.push(commentId);
      var replyForm =
        '<form class="addNewReply"><span class="pull-right cb-delete"><i class="fas fa-times replyToComment" aria-hidden="true"></i></span> <textarea id="commentReply" class="form-control" rows="3" cols="30"></textarea><br><button type="submit" class="btn btn-cb2 pull-right"> Reply</button></form>';
      // var textArea = "<textarea class='form-control' rows='3' cols='30' id='commentReply' />";
      $("#" + commentId + "replyToCommentSection").append(replyForm);
      Session.set("replyToComment", replyToComment);
    }
  },

  "submit .addNewReply": function(event, template) {
    event.preventDefault();

    if ($.trim($("#commentReply").val()) == "") {
      swal({
        title: TAPi18n.__("Comment can't be empty"),
        // text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("ok"),
        type: "info"
      });

      return;
    }

    var commentId = this._id;
    var parentSlug = this.slug;
    var slug = Random.secret(7);
    var full_slug = parentSlug + "/" + slug;
    var comment = {
      discussionId: FlowRouter.getParam("hangoutId"),
      slug: full_slug,
      authorId: Meteor.userId(),
      authorName: Meteor.user().username,
      authorAvatar: Meteor.user().profile.avatar.default,
      text: $("#commentReply")
        .val()
        .replace(/\r?\n/g, "<br />"),
      parent_id: commentId
    };
    var replyToComment = Session.get("replyToComment");
    replyToComment = _.pull(replyToComment, commentId);
    Session.set("replyToComment", replyToComment);

    Meteor.call("addComments", comment, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        $("#" + commentId + "replyToCommentSection").empty();
      }
    });
  },
  "click .delete": function(event, template) {
    var data = {
      commentId: this._id,
      authorId: this.authorId,
      slug: this.slug,
      discussionId: this.discussionId
    };

    Meteor.call("deleteComments", data, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
      }
    });
  },
  "change #commentFilter": function(event, template) {
    var commentFilter = template.find("#commentFilter").value;
    Session.set("commentFilter", commentFilter);
  }
});
