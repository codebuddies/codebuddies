Template.discussion.onCreated(function () {

  const instance = this;
  instance.subscribe('discussionById', FlowRouter.getParam('discussionId'));
  instance.subscribe('responsesByDiscussionId', FlowRouter.getParam('discussionId'));
  instance.discussionResponsePreview = new ReactiveVar('');
});


Template.discussion.helpers({
  discussion() {
    return Discussions.findOne({"_id": FlowRouter.getParam('discussionId')});
  },
  responses() {
    // console.log(DiscussionResponses.find({}).count());
    return DiscussionResponses.find({},{sort: { created_at: 1}})
  },
  discussionResponsePreview() {
    return Template.instance().discussionResponsePreview.get();
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
  "change #discussionResponse": function(event, template){
    event.preventDefault();
    template.discussionResponsePreview.set(($.trim(template.find("#discussionResponse").value)))
  },
  "submit .response-form": function(event, template){
    event.preventDefault();
    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ( $.trim(template.find("#discussionResponse").value) == '') {
      $('#discussionResponse').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Response Can\'t be empty', 'warning', 'growl-top-right' );
    }

    const data = {
      discussion_id: this._id,
      parent_id: "empty",
      text: $.trim(template.find("#discussionResponse").value),
    }



    Meteor.call("discussionResponses.insert", data, function(error, result){
      if(error){
        console.log("error", error);

      }
      if(result){
        // clear response box
        template.find("#discussionResponse").value = '' ;
        template.discussionResponsePreview.set('');
      }
    });



  },
  "click #deleteDiscussion": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }
    sweetAlert({
        type: 'warning',
        title: "Are you sure ?",
        cancelButtonText: TAPi18n.__("no_delete_hangout"),
        confirmButtonText: TAPi18n.__("yes_delete_hangout"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: false,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();

        Meteor.call('discussions.remove', data, function(error, result) {
          if (result) {
            swal("Poof!", "Your Discussion has been successfully deleted!", "success");
          } else {
            swal("Oops something went wrong!", error.error + "\n Try again", "error");
          }
        });

      }); //sweetAlert
  },
  "click #editResponse": function(event, template){
     event.preventDefault();
     Modal.show("editResponseModal", this);
  },
  "click #deleteDiscussionResponse": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }
    sweetAlert({
        type: 'warning',
        title: "Are you sure ?",
        cancelButtonText: TAPi18n.__("no_delete_hangout"),
        confirmButtonText: TAPi18n.__("yes_delete_hangout"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: false,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();

        Meteor.call('discussionResponses.remove', data, function(error, result) {
          if (result) {
            swal("Poof!", "Your Discussion has been successfully deleted!", "success");
          } else {
            swal("Oops something went wrong!", error.error + "\n Try again", "error");
          }
        });

      }); //sweetAlert
  },
  "click .rupvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }
    Meteor.call("discussionResponses.upvote", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Voted', 'success', 'growl-top-right' );
      }
    });
  },
  "click .rdownvote": function(event) {
    event.preventDefault();
    const data = {
      id: this._id
    }

    Meteor.call("discussionResponses.downvote", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Voted', 'success', 'growl-top-right' );
      }
    });
  },
});
