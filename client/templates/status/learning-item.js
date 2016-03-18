Template.learningItem.helpers({
  buttonStatus: function() {
    for(var index in Template.instance().data.hasLiked) {
      if(Template.instance().data.hasLiked[index] == Meteor.userId()) {
        return true;
      }
    }
    return false;
  },

  isOwner:  function () {
    return this.owner === Meteor.userId();
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
      Meteor.call('incrementKudoCount', this._id, Meteor.userId(), function(error, result) { });
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
      Meteor.call('decrementKudoCount', this._id, Meteor.userId(), function(error, result) { });
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
      console.log("id: " + this._id + " " + this.text);
      Modal.show('editLearningModal');
      $('#edit-learning-modal #topic').val(this.text);
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
