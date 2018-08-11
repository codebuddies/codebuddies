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
  "unsubscribe.me"(linkId) {
    check(linkId, String);

    // fetch the link details
    const {
      recipient_id,
      email_type,
      discussion_id
    } = UnsubscribeLinks.findOne({ _id: linkId });

    const emails_preference = [
      "join_hangout",
      "rsvp_to_hangout",
      "delete_hangout",
      "new_hangout",
      "new_member",
      "new_discussion",
      "bi_weekly_newsletter",
      "monthly_update"
    ];

    if (email_type === "new_discussion_response") {
      //unsubscribe from discussion
      Discussions.update(
        { _id: discussion_id },
        {
          $pull: {
            subscribers: { id: recipient_id }
          }
        }
      );
    }

    if (emails_preference.indexOf(email_type) != -1) {
      //update email emails_preference
      Meteor.users.update(
        { _id: recipient_id },
        { $pull: { emails_preference: email_type } }
      );
    }

    //update link status
    UnsubscribeLinks.update({ _id: linkId }, { $set: { valid: false } });

    return true;
  }
});
