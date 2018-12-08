Meteor.publish("conversationsForCurrentUser", function() {
  if (this.userId) {
    return Conversations.find({ "participants.id": this.userId }, { sort: { sent: -1 } });
  }
  this.ready();
});
