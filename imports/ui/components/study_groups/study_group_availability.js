Template.studyGroupAvailability.onCreated(function() {
  let instance = this;
  let studyGroupId = FlowRouter.getParam("studyGroupId");
  instance.subscribe("allStudyGroupAvailability", studyGroupId);
});

Template.studyGroupAvailability.helpers({
  groupMembersAvailabilities() {
    return Availabilities.find(
      {
        "study_group.id": FlowRouter.getParam("studyGroupId"),
        "author.id": { $ne: Meteor.userId() }
      },
      { sort: { start_day: 1, start_hour: 1, start_minute: 1 } }
    );
  },
  currentUsersAvailabilities() {
    return Availabilities.find(
      { "study_group.id": FlowRouter.getParam("studyGroupId"), "author.id": Meteor.userId() },
      { sort: { start_day: 1, start_hour: 1, start_minute: 1 } }
    );
  }
});

Template.studyGroupAvailability.events({
  "click #addSlot"(event, template) {
    Modal.show("editStudyGroupAvailabilitySlotModal", this);
  },
  "click #removeSlot"(event, template) {
    event.preventDefault();
    const data = {
      availabilityId: this._id,
      studyGroupId: this.study_group.id
    };
    Meteor.call("removeAvailabilitySlot", data, function(error, result) {
      if (error) {
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        Bert.alert("Slot has been removed", "success", "growl-top-right");
      }
    });
  }
});
