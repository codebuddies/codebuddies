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
  },
  emails_preference() {
    const { recipient_id = null } =
      UnsubscribeLinks.findOne({
        _id: FlowRouter.getParam("unsubscribeLinkId")
      }) || {};

    if (recipient_id) {
      const user = Meteor.users.findOne({ _id: recipient_id });
      return (user && user.emails_preference) || [];
    }
    return [];
  }
});

Template.unsubscribeFromMailingList.events({
  "click #updateEmailPreferences"(event, template) {
    const unsubscribeLinkId = FlowRouter.getParam("unsubscribeLinkId");
    const selected_emails_preference = template.findAll(
      "input[name=email_preference]:checked"
    );
    const results = selected_emails_preference.map(e => e.defaultValue);
    const data = { linkId: unsubscribeLinkId, emails_preference: results };

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
