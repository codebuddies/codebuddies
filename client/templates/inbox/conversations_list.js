Template.conversations_list.onCreated(function() {
  let instance = this;
  const title = "CodeBuddies | conversation";
  DocHead.setTitle(title);

  instance.autorun(function() {
    instance.subscribe("conversationsForCurrentUser");
  });
});

Template.conversations_list.helpers({
  conversations() {
    return Conversations.find({}, { sort: { sent: -1 } });
  }
});
