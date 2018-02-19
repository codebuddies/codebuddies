Template.studyGroupsSearchResult.onCreated(function() {
  this.autorun(() => {
    if (!_.isEmpty(Session.get('sgSearchTerm'))){
    this.subscribe('studyGroupSearch', Session.get('sgSearchTerm'));
    }

  });
});

Template.studyGroupsSearchResult.helpers({
  sgSearchTerm() {
    return Session.get('sgSearchTerm');
  },
  searchResults() {
    return StudyGroups.search(Session.get('sgSearchTerm'));
  }
});


Template.allStudyGroups.events({
  'click .btn-leave-study-group-1': function(event, template) {
    event.preventDefault();
    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    }

    Meteor.call("leaveStudyGroup", data, function(error, result) {
      if(error) {
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'You have left the study group!', 'success', 'growl-top-right' );
      }
    });
  },
  'click .btn-join-study-group-1': function(event, template) {
    event.preventDefault();
    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    }

    Meteor.call("joinStudyGroup", data, function(error, result){
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'You have joined the study group!', 'success', 'growl-top-right' );

      }
    });
  }
});
