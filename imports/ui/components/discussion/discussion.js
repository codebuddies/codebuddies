Template.discussion.onCreated(function() {
  const instance = this;
  instance.subscribe("discussionById", FlowRouter.getParam("discussionId"));
});

Template.discussion.helpers({
  discussion() {
    return Discussions.findOne({ _id: FlowRouter.getParam("discussionId") });
  }
});
