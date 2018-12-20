// import { ReactiveVar } from 'meteor/reactive-var';
import { UnsubscribeLinks } from "../../../imports/api/unsubscribe_links/unsubscribe_links";
Template.unsubscribeFromMailingList.onCreated(function() {
  const instance = this;
  instance.processing = new ReactiveVar(false);
  instance.list = new ReactiveVar([]);
  instance.subscribe("unsubscribe.link", FlowRouter.getParam("unsubscribeLinkId"));

  Meteor.call("users.getEmailPreferences", FlowRouter.getParam("unsubscribeLinkId"), (error, result) => {
    instance.list.set(result);
  });
});

Template.unsubscribeFromMailingList.helpers({
  unsubscribeLink() {
    return UnsubscribeLinks.findOne({
      _id: FlowRouter.getParam("unsubscribeLinkId")
    });
  },
  emails_preference() {
    return Template.instance().list.get();
  }
});

Template.unsubscribeFromMailingList.events({
  "click #updateEmailPreferences"(event, template) {
    const unsubscribeLinkId = FlowRouter.getParam("unsubscribeLinkId");

    const emails_preference = [];
    $("input[name=email_preference]:checked").each(function() {
      emails_preference.push($(this).val());
    });

    const data = {
      linkId: unsubscribeLinkId,
      emails_preference: emails_preference
    };

    template.processing.set(true);
    Meteor.call("unsubscribe.me", data, function(error, result) {
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
