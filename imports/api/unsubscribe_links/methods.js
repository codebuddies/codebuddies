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
    check(data, { linkId: String, emails_preference: [String] });
    const { linkId, emails_preference } = data;

    // fetch the link details
    const {
      recipient_id,
      email_type,
      discussion_id
    } = UnsubscribeLinks.findOne({ _id: linkId });

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

    emails_preference.forEach(email_preference =>
      //update email emails_preference
      Meteor.users.update(
        { _id: recipient_id },
        { $pull: { emails_preference: email_preference } }
      )
    );

    //update link status
    UnsubscribeLinks.update({ _id: linkId }, { $set: { valid: false } });

    return true;
  }
});
