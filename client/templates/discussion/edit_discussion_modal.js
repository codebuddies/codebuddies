Template.editDiscussionModal.onCreated(function(){
   const instance = this;
   instance.processing = new ReactiveVar(false);
   instance.discussionDescriptionPreview = new ReactiveVar('');
});

Template.editDiscussionModal.onRendered(function(){
  const instance = this;
  instance.discussionDescriptionPreview.set(instance.data.description)


  let tags = [ 'Below are some popular tags. White spaces are supported.', 'JavaScript', 'Python', 'Go', 'CSS', 'PHP', 'R', 'NodeJS', 'D3', 'MongoDB', 'Meteor', 'Java'];


  instance.data.tags.forEach((tag)=> {
    if (tags.indexOf(tag) < 0) {
      tags.push(tag);
    }
  })

  tags = tags.map((tag) => {
    if (instance.data.tags.indexOf(tag) > -1) {
      return {id: tag, text: tag, selected: true}
    }
    return {id: tag, text: tag}
  })


  Meteor.setTimeout(function () {

    instance.$(".discussion-tags-multiple", tags).select2({
      placeholder: "Tags (required)",
      data: tags,
      tags: false,
      tokenSeparators: [','],
      allowClear: true
    });

  },500)

});

Template.editDiscussionModal.helpers({
  processing: function(){
    return Template.instance().processing.get();
  },
  discussionDescriptionPreview: function(){
    // console.log(Template.instance().discussionDescriptionPreview.get());

    return Template.instance().discussionDescriptionPreview.get();
  }
});

Template.editDiscussionModal.events({
  "change #discussionDescription": function(event, template){
    event.preventDefault();
    template.discussionDescriptionPreview.set(($.trim(template.find("#discussionDescription").value)))
  },
  "submit .editDiscussion": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#discussionTopic").value) == '') {
      $('#discussionTopic').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Topic', 'warning', 'growl-top-right' );
    }

    if (!$(".discussion-tags-multiple").val() ||$(".discussion-tags-multiple").val().length < 1) {
      $('.discussion-tags-multiple').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Please save at least 1 tag. ', 'warning', 'growl-top-right' );
    }

    if ( $.trim(template.find("#discussionDescription").value) == '') {
      $('#discussionDescription').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Description', 'warning', 'growl-top-right' );
    }

    const data = {
      id: this._id,
      topic: $.trim(template.find("#discussionTopic").value),
      description: $.trim(template.find("#discussionDescription").value),
      tags: $(".discussion-tags-multiple").val()
    }

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
