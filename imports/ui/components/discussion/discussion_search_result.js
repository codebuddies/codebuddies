Template.discussionSearchResult.onCreated(function() {
  this.autorun(() => {
    if (!_.isEmpty(Session.get("discussionSearchTerm"))) {
      this.subscribe("discussionsSearch", Session.get("discussionSearchTerm"));
    }
  });
});

Template.discussionSearchResult.helpers({
  discussionSearchTerm() {
    return Session.get("discussionSearchTerm");
  },
  searchResults() {
    return Discussions.search(Session.get("discussionSearchTerm"));
  }
});
