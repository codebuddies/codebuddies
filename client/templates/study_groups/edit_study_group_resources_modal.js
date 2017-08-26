Template.editStudyGroupResourcesModal.onCreated(function () {
  let instance = this;
  instance.processing = new ReactiveVar(false);
});

Template.editStudyGroupResourcesModal.helpers({
  processing() {
    return  Template.instance().processing.get();
  }
});

Template.editStudyGroupResourcesModal.events({
  "submit .updateStudyGroupResources": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#sgResourceTitle").value) == '') {
      $('#sgResourceTitle').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Resource Title', 'warning', 'growl-top-right' );
    }
    if ($.trim(template.find("#sgResourceURL").value) == '') {
      $('#sgResourceURL').css({ 'border': '#FF0000 1px solid'});
      return Bert.alert( 'Resource URL', 'warning', 'growl-top-right' );
    }

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug,
      resourceTitle: template.find("#sgResourceTitle").value,
      resourceURL : template.find("#sgResourceURL").value
    }

    // console.log(data);
    template.processing.set( true );

    Meteor.call("addResource", data, function(error, result){
      if(error){
        template.processing.set( false );
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'Link has been added', 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
