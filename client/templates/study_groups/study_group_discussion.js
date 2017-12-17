Template.studyGroupDiscussion.onCreated(function() {
   let instance = this;
   instance.limit = new ReactiveVar(20);
   instance.flag = new ReactiveVar(false);

   instance.autorun(function () {
     let limit = instance.limit.get();
     let studyGroupId = FlowRouter.getParam('studyGroupId');
     instance.subscribe('studyGroupDiscussions', studyGroupId, limit);
   });

   instance.loadDiscussions = function() {
     return Discussions.find();
   }

});

Template.studyGroupDiscussion.onRendered(function() {
    let instance = this;

    instance.scrollHandler = function(){

      if  ($(window).scrollTop() > ($(document).height() - $(window).height()) -20 && !instance.flag.get()){

        if(Discussions.find().count() === instance.limit.get()){
             instance.limit.set(instance.limit.get() + 9);
             $('body').addClass('stop-scrolling');
        }else{
           if(Discussions.find().count() < instance.limit.get()){
               instance.flag.set(true);
           }else {

           }
        }

      }

    }.bind(instance);
    $(window).on("scroll" ,instance.scrollHandler);

});



Template.studyGroupDiscussion.helpers({
  discussions: function(){
    return Template.instance().loadDiscussions();
  },
  status:function(){
    return  Template.instance().flag.get();
  }
});


Template.studyGroupDiscussion.events({
  "click #addDiscussion" (event, template){
     Modal.show("addDiscussionModal", this);
  },
  "click .edit-discussion": function(event) {
    event.preventDefault();
    Modal.show("editDiscussionModal", this);
  },
  "click .delete-discussion": function(event) {
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
  "click .report-discussion": function(event) {
    event.preventDefault();
    // @todo : report it
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
