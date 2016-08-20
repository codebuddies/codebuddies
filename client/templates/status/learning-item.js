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
    if (userId && !_.includes(this.hasLiked, userId)) {
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
  }

});

Template.learningItem.events({
  'click .btn-like': function(event, template) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('incrementKudoCount', this._id, function(error, result) { });
    }
  },

  'click .btn-unlike': function(event, template) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Meteor.call('decrementKudoCount', this._id, function(error, result) { });
    }
  },

  'click .edit-learning': function(event) {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_update_status"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {
      Session.set('learningId', this._id);
      Modal.show('editLearningModal');
      $('#edit-learning-modal #title').val(this.title);
    }
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
    }
  );
}

});
