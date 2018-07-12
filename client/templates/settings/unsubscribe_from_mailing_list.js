// import { ReactiveVar } from 'meteor/reactive-var';
import { UnsubscribeLinks } from "../../../imports/api/unsubscribe_links/unsubscribe_links";
Template.unsubscribeFromMailingList.onCreated(function() {
  const instance = this;
  instance.processing = new ReactiveVar(false);
  instance.subscribe(
    "unsubscribe.link",
    FlowRouter.getParam("unsubscribeLinkId")
  );
});

Template.unsubscribeFromMailingList.helpers({
  unsubscribeLink() {
    return UnsubscribeLinks.findOne({
      _id: FlowRouter.getParam("unsubscribeLinkId")
    });
  }
});

Template.unsubscribeFromMailingList.events({
  "click #updateEmailPreferences"(event, template) {
    const unsubscribeLinkId = FlowRouter.getParam("unsubscribeLinkId");
    template.processing.set(true);
    Meteor.call("unsubscribe.me", unsubscribeLinkId, function(error, result) {
      if (error) {
        template.processing.set(false);
        Bert.alert(error.reason, "danger", "growl-top-right");
      }
      if (result) {
        FlowRouter.go("/");
        template.processing.set(false);
        Bert.alert("Successfully Unsubscribed", "success", "growl-top-right");
      }
    });
  },
  "click #cancel"(event, template) {
    FlowRouter.go("/");
  }
});
