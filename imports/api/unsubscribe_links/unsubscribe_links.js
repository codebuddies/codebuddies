import { Mongo } from "meteor/mongo";

export const UnsubscribeLinks = new Mongo.Collection("unsubscribe_links");

UnsubscribeLinks.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});
