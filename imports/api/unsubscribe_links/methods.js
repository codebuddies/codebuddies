import { UnsubscribeLinks } from "./unsubscribe_links";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
/**
 * get list of new discussion responses
 * @function
 * @name unsubscribeMe
 * @return { Boolean } true if unsubscribed
 */
Meteor.methods({
  "unsubscribe.me"(data) {
    check(data, {
      linkId: String,
      emails_preference: [String]
    });

    const { linkId, emails_preference } = data;
    // fetch the link details
    const { recipient_id, valid } = UnsubscribeLinks.findOne({ _id: linkId });

    if (!valid) {
      throw new Meteor.Error("unsubscribe.me", "Link expired.");
    }

    const default_emails_preference = [
      "join_hangout",
      "rsvp_to_hangout",
      "delete_hangout",
      "new_hangout",
      "new_member",
      "new_discussion",
      "bi_weekly_newsletter",
      "monthly_update"
    ];

    emails_preference.forEach(item => {
      if (default_emails_preference.indexOf(item) == -1) {
        throw new Meteor.Error("unsubscribe.me", "invalid preference.");
      }
    });

    Meteor.users.update({ _id: recipient_id }, { $set: { emails_preference: emails_preference } });

    //update link status
    UnsubscribeLinks.update({ _id: linkId }, { $set: { valid: false } });

    return true;
  }
});
