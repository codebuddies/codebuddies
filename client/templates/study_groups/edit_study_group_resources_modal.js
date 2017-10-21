Template.editStudyGroupResourcesModal.onCreated(function () {
  let instance = this;
  instance.processing = new ReactiveVar(false);
  instance.alert = new ReactiveVar(false);
});

Template.editStudyGroupResourcesModal.helpers({
  processing() {
    return  Template.instance().processing.get();
  },
  alert() {
    return Template.instance().alert.get();
  }
});

Template.editStudyGroupResourcesModal.events({
  "submit .updateStudyGroupResources": function(event, template){
    event.preventDefault();

    $('.form-control').css({ "border": '1px solid #cccccc'});

    if ($.trim(template.find("#sgResourceTitle").value) == '') {
      $('#sgResourceTitle').css({ 'border': '#FF0000 1px solid'});
      return template.alert.set( { type: "alert-warning", message: "Resource Title" } );
    }
    if ($.trim(template.find("#sgResourceURL").value) == '') {
      $('#sgResourceURL').css({ 'border': '#FF0000 1px solid'});
      return template.alert.set( { type: "alert-warning", message: "Resource URL" } );
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
    template.alert.set ( false );

    Meteor.call("addResource", data, function(error, result){
      if(error){
        template.processing.set( false );
        template.alert.set( { type: "alert-danger", message: error.reason } );
      }
      if(result){
        template.processing.set( false );
        Bert.alert( 'Link has been added', 'success', 'growl-top-right' );
        Modal.hide()
      }
    });

  }
});
