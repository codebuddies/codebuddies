Meteor.publish("messagesByConvoId", function(conversationId, limit) {
  check(conversationId, String);

  if (this.userId) {
    return Messages.find({ conversation_id: conversationId }, { sort: { sent: -1 }, limit: limit });
  }
  this.ready();
});
