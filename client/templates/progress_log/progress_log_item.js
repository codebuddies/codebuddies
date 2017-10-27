Template.progressLogItem.helpers({
  isAuthor () {
    return this.author.id === Meteor.userId();
  }
});

Template.progressLogItem.events({
  "click .removeProgressLog" (event, template){
     event.preventDefault();
     var logId = this._id;
     sweetAlert({
       title: TAPi18n.__("delete_hangout_confirm"),
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
          Meteor.call('removeProgressLog', logId, function(error, result) {
            if(result) {
              swal("Poof!", "Your Progress Log has been deleted!");
            }
            else {
              swal("Oops!  Something went wrong", error.error, + "\n Try again!", "error");
            }
          });
        }
      });
  },
  "click .editProgressLog" (event, template){
     event.preventDefault();

     Modal.show('editProgressLogModal', this);
  }
});
