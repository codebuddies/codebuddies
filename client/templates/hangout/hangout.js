import QuillEditor from '../../libs/QuillEditor';

Meteor.startup(function() {
    $('head').append('<link href="https://cdn.quilljs.com/1.0.3/quill.snow.css" rel="stylesheet">');
    //$('head').append('<script src="https://meet.jit.si/external_api.js"></script>');
});


Template.hangout.onCreated(function() {
  var title = "CodeBuddies | Hangout";
  DocHead.setTitle(title);

  this.subscribe("hangoutById", FlowRouter.getParam('hangoutId'));
});

Template.hangout.rendered = function() {
 // $('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');
}

Template.hangout.helpers({
  formatDescription: ({description_in_quill_delta, description}) => {
    if (description_in_quill_delta) {
      return QuillEditor.generateHTMLForDeltas(description_in_quill_delta);
    } else {
      return description;
    }
  },
  hangout: function() {
      return Hangouts.findOne({_id: FlowRouter.getParam('hangoutId')});
  }
});
Template.hangout.events({
  'click .join-hangout': function() {
    // if (!Meteor.userId()) {
    //   sweetAlert({
    //     title: TAPi18n.__("you_are_almost_there"),
    //     text: TAPi18n.__("login_join_hangout"),
    //     confirmButtonText: TAPi18n.__("sign_in_with_slack"),
    //     type: 'info'
    //   },
    //   function(){
    //     var options = {
    //       requestPermissions: ['identify', 'users:read']
    //     };
    //     Meteor.loginWithSlack(options);
    //   });
    // } else {

      const data = {
        hangoutId: this._id,
        hostId: this.host.id
      }
    //  }

      Meteor.call('addUserToHangout', data, function(error, result) {
        if (result) {
          sweetAlert({
            title: TAPi18n.__("you_are_awesome"),
            text: TAPi18n.__("looking_forward_to_see_you"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'info'
          });
        }
      });
  },
  'click #leave-hangout': function() {
    if (this.host.id == Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("remove_owner_from_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'warning'
      });
    } else {

      const data = {
        hangoutId: this._id,
        hostId: this.host.id,
      }

      Meteor.call('removeUserFromHangout', data, function(error, result) {
        if (result) console.log('removed');
      });
    }
  },
  'click #end-hangout': function(){

    const data = {
      hangoutId: this._id,
    }

    sweetAlert({
        type: 'warning',
        title: TAPi18n.__("end_hangout_confirm"),
        cancelButtonText: TAPi18n.__("no_end_hangout"),
        confirmButtonText: TAPi18n.__("yes_end_hangout"),
        confirmButtonColor: "#d9534f",
        showCancelButton: true,
        closeOnConfirm: false,
      },
      function() {
        // disable confirm button to avoid double (or quick) clicking on confirm event
        swal.disableButtons();
        // if user confirmed/selected yes, let's call the delete hangout method on the server

        Meteor.call('endHangout', data, function(error, result) {
          if (result) {
            swal("Poof!", "Your hangout has been successfully ended!", "success");
          } else {
            swal("Oops something went wrong!", error.error + "\n Try again", "error");
          }
        });

      }); //sweetAlert

  },
  "click #create-hangout-popup": function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("login_create_hangout_title"),
        text: TAPi18n.__("login_create_hangout_message"),
        confirmButtonText: TAPi18n.__("sign_in_with_slack"),
        type: 'info'
      },
      function(){
        var options = {
          requestPermissions: ['identify', 'users:read']
        };
        Meteor.loginWithSlack(options);
      });
    } else {
      Modal.show('createHangoutModal');
    }
  },
  "click #hangout-faq-popup": function() {
    Modal.show('hangoutFAQModal');
  }
});
