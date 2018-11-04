Template.supportHangoutOrganizer.helpers({
  supportLinks() {
    const organizerId = Template.instance().data.organizerId;
    if (organizerId) {
      console.log(ReactiveMethod.call("users.getSupportLink", organizerId));
      return ReactiveMethod.call("users.getSupportLink", organizerId);
    } else {
      return false;
    }
  }
});

Template.supportHangoutOrganizer.events({
  "click #editProfileInfo": function(event, template) {
    event.preventDefault();
    const actor = Meteor.user();
    FlowRouter.go(`/profile/${actor.username}/${actor._id}`);
    Session.set("editMode", true);
    $("html, body").animate({ scrollTop: 0 }, "slow");
  }
});
