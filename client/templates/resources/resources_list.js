Template.resourcesList.onCreated(function() {
  this.subscribe('resourcesByStudyGroup', FlowRouter.getParam('studyGroupId'));
});

Template.resourcesList.helpers({
  resources: function(){
    return Resources.find();

  }
});

Template.resourcesList.events({
  "click .delete-resource": function(event, template) {
    Meteor.call("deleteResource", this._id, function(error, result) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Link removed', 'success', 'growl-top-right' );
      }
    });
  },
});
