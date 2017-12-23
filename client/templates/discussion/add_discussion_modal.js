Template.addDiscussionModal.onCreated(function(){
   const instance = this;
   instance.processing = new ReactiveVar(false);
   instance.discussionDescriptionPreview = new ReactiveVar('');
});

Template.addDiscussionModal.helpers({
  processing: function(){
    return Template.instance().processing.get();
  },
  discussionDescriptionPreview: function(){
    return Template.instance().discussionDescriptionPreview.get();
  }
});

Template.addDiscussionModal.events({
  "change #discussionDescription": function(event, template){
    event.preventDefault();
    template.discussionDescriptionPreview.set(($.trim(template.find("#discussionDescription").value)))
  },
  "submit .addDiscussion": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#discussionTopic").value) == '') {
      $('#discussionTopic').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Topic', 'warning', 'growl-top-right' );
    }
    if ( $.trim(template.find("#discussionDescription").value) == '') {
      $('#discussionDescription').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Description', 'warning', 'growl-top-right' );
    }

    // console.log(this);
    const data = {
      topic: $.trim(template.find("#discussionTopic").value),
      description: $.trim(template.find("#discussionDescription").value),
      groupId: this._id,
      groupTitle: this.title,
      groupSlug: this.slug
    }

    console.log(data);
    template.processing.set( true );

    Meteor.call("discussions.insert", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason , 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'Discussion Created!' , 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
