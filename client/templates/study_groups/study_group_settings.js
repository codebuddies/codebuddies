Template.studyGroupSettings.events({
  "click #archiveStudyGroup":function (event, template) {

    const studyGroupId = this._id;

    Meteor.call("archiveStudyGroup", studyGroupId ,function (error, result) {
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        FlowRouter.go("all study groups");
        return Bert.alert( 'Study Group Archived', 'success', 'growl-top-right' );
      }
    })
  }
});
