Template.discussionNewResponse.onCreated(function () {

  const instance = this;
  instance.discussionResponsePreview = new ReactiveVar('');

});

Template.discussionNewResponse.helpers({
  discussionResponsePreview() {
    return Template.instance().discussionResponsePreview.get();
  }
});
Template.discussionNewResponse.events({
  "change #discussionResponse": function(event, template){
    event.preventDefault();
    template.discussionResponsePreview.set(($.trim(template.find("#discussionResponse").value)))
  },
  "submit .response-form": function(event, template){
    event.preventDefault();
    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ( $.trim(template.find("#discussionResponse").value) == '') {
      $('#discussionResponse').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Response Can\'t be empty', 'warning', 'growl-top-right' );
    }

    const data = {
      discussion_id: this._id,
      parent_id: "empty",
      text: $.trim(template.find("#discussionResponse").value),
    }



    Meteor.call("discussionResponses.insert", data, function(error, result){
      if(error){
        console.log("error", error);

      }
      if(result){
        // clear response box
        template.find("#discussionResponse").value = '' ;
        template.discussionResponsePreview.set('');
      }
    });

  },
});
