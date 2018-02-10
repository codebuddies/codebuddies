Template.discussionResponsesList.onCreated(function () {

  const instance = this;
  instance.subscribe('responsesByDiscussionId', FlowRouter.getParam('discussionId'));

});


Template.discussionResponsesList.helpers({
  responses() {
    return DiscussionResponses.find({},{sort: { created_at: 1}})
  },
});
