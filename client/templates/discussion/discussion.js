Template.discussion.onCreated(function () {

  const instance = this;
  instance.subscribe('discussionById', FlowRouter.getParam('discussionId'));

});


Template.discussion.helpers({
  discussion() {
    return Discussions.findOne({"_id": FlowRouter.getParam('discussionId')});
  }
});


Template.discussion.events({
  "click #editDiscussion": function(event, template){
     event.preventDefault();
     Modal.show("editDiscussionModal", this);
  },
  "click #subscribe": function(event, template){
     event.preventDefault();
     const data = {
       id: this._id
     }

     Meteor.call("discussions.subscribe", data, function(error, result){
       if(error){
         Bert.alert( error.reason , 'danger', 'growl-top-right' );
       }
       if(result){
         Bert.alert( 'Subscribed!' , 'success', 'growl-top-right' );
       }
     });

  },
  "click #unsubscribe": function(event, template){
    event.preventDefault();
    const data = {
      id: this._id
    }

    Meteor.call("discussions.unsubscribe", data, function(error, result){
      if(error){
        Bert.alert( error.reason , 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Unsubscribed!' , 'success', 'growl-top-right' );
      }
    });

  },
  "click .upvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }
    Meteor.call("discussions.upvote", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Voted', 'success', 'growl-top-right' );
      }
    });
  },
  "click .downvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }

    Meteor.call("discussions.downvote", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Voted', 'success', 'growl-top-right' );
      }
    });
  },
});
