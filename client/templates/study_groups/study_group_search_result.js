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
