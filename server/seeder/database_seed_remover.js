import { Meteor } from "meteor/meteor";

export const databaseSeedRemover = () => {
  Meteor.users.remove({ "profile.document_type": "SEED" });
  Hangouts.remove({ document_type: "SEED" });
  Learnings.remove({ document_type: "SEED" });
  StudyGroups.remove({ document_type: "SEED" });
  Discussions.remove({ document_type: "SEED" });

  console.log("seed data removed");
};
