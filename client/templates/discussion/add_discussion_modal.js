Template.addDiscussionModal.events({
  "submit .addDiscussion": function(event, template){
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
      topic: $.trim(template.find("#discussionTopic").value),
      description: $.trim(template.find("#discussionDescription").value),
      groupId: this._id,
      groupTitle: this.title,
      groupSlug: this.slug,
    }

    // console.log(data);
    // template.processing.set( true );

    // Meteor.call("discussionAdd", data, function(error, result){
    //   if(error){
    //     template.processing.set( false );
    //     Bert.alert( error.reason , 'danger', 'growl-top-right' );
    //   }
    //   if(result){
    //     template.processing.set( false );
    //     Bert.alert( 'Description updated!' , 'success', 'growl-top-right' );
    //     Modal.hide()
    //   }
    // });

  }
});
