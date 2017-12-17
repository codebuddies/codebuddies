Template.editDiscussionModal.onCreated(function(){
   const instance = this;
   instance.processing = new ReactiveVar(false);
});
Template.editDiscussionModal.helpers({
  processing: function(){
    return Template.instance().processing.get();
  }
});

Template.editDiscussionModal.events({
  "submit .editDiscussion": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#discussionTopic").value) == '') {
      $('#discussionTopic').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Study Group Introduction', 'warning', 'growl-top-right' );
    }
    if ( $("#discussionDescription").val().length > 140) {
      $('#discussionDescription').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Study Group Introduction', 'warning', 'growl-top-right' );
    }

    // console.log(this);
    const data = {
      id: this._id,
      topic: $.trim(template.find("#discussionTopic").value),
      description: $.trim(template.find("#discussionDescription").value),
    }

    console.log(data);
    template.processing.set( true );

    Meteor.call("discussions.update", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason , 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'Discussion Updated!' , 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
