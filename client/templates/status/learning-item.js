Template.registerHelper("learningOwner", function(ownerid){
  if(Meteor.userId() === ownerid){
      return true;
  }else {
      return false;
  }

});
Template.learningItem.helpers({
  buttonStatus: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.hasLiked, userId)) {
      return false;
    } else {
    return true;
    }
  },

  isOwner:  function () {
    return this.userId === Meteor.userId();
  },
  learningTime: function() {
    return moment(this.created_at).format("dddd, MMM DD, YYYY");
  },
  learningTitle: function(){
    var pattern = /((http|https)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g
    return _.escape(this.title).replace(pattern, "<a href=\"$1\">$1</a>")
  }

});

Template.learningItem.events({
  'click .btn-like': function(event, template) {
    Meteor.call('incrementKudoCount', this._id, function(error, result) { });
  },

  'click .btn-unlike': function(event, template) {
    Meteor.call('decrementKudoCount', this._id, function(error, result) { });
  },

  'click .edit-learning': function(event) {
    Session.set('learningId', this._id);
    Modal.show('editLearningModal');
    $('#edit-learning-modal #title').val(this.title);
  },

  'click .delete-learning': function(event, learningId) {
    var learningId = this._id;
    sweetAlert({
      title: TAPi18n.__("delete_learning_confirm"),
      showCancelButton: true,
      cancelButtonText: TAPi18n.__("no_delete_learning"),
      confirmButtonText: TAPi18n.__("yes_delete_learning"),
      confirmButtonColor: "#d9534f",
      closeOnConfirm: false,
      closeOnCancel: true,
      type: 'warning'
    },
    function(isConfirm) {
      if(isConfirm) {
        Meteor.call('deleteLearning', learningId, Meteor.userId(), function(error, result) {
          if(result) {
            swal("Poof!", "Your learning was deleted!");
          }
          else {
            swal("Oops!  Something went wrong", error.error, + "\n Try again!", "error");
          }
        });
      }
    });
  }
});
