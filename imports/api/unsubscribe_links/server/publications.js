import { Meteor } from "meteor/meteor";
import { UnsubscribeLinks } from "../unsubscribe_links";
import { check } from "meteor/check";

Meteor.publish("unsubscribe.link", function(linkId) {
  check(linkId, String);

  return UnsubscribeLinks.find({ _id: linkId });
});
