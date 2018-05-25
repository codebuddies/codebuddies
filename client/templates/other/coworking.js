Template.coworking.events({
  "click .create-hangout-popup": function() {
    Modal.show("createHangoutModal");
  }
});

Template.coworking.helpers({
  numParticipants: function(studyGroupId) {
    const hangoutId = `cb`;
    const appState = AppStats.findOne({ _id: hangoutId });
    console.log(appState);
    if (appState && appState.participants) {
      return appState.participants.length;
    }
    return 0;
  }
});
