import { check, Match } from "meteor/check";
import { UnsubscribeLinks } from "../../imports/api/unsubscribe_links/unsubscribe_links";
Meteor.methods({
  getUserDetails: function(userId) {
    check(userId, String);
    return Meteor.users.findOne({ _id: userId }, { fields: { emails: 0, services: 0, roles: 0, email: 0 } });
  },

  setUserProfile: function(profileInfo) {
    var pattern = {
      firstname: String,
      lastname: String,
      bio: String,
      website: String,
      twitter: String,
      github: String,
      facebook: String,
      linkedin: String,
      buymeacoffee: String,
      patreon: String,
      nonprofit: String,
      skillHelpOthersWith: String,
      skillWantToImprove: String
    };

    // check(profileInfo, pattern);
    if (!this.userId) {
      throw new Meteor.Error("users.methods.setUserProfile.not-logged-in", "Must be logged in.");
    }
    Meteor.users.update(
      { _id: Meteor.userId() },
      {
        $set: {
          "profile.firstname": profileInfo.firstname,
          "profile.lastname": profileInfo.lastname,
          "profile.bio": profileInfo.bio,
          "profile.website": profileInfo.website,
          "profile.social.twitter": profileInfo.twitter,
          "profile.social.github": profileInfo.github,
          "profile.social.facebook": profileInfo.facebook,
          "profile.social.linkedin": profileInfo.linkedin,
          "profile.support_links.patreon": profileInfo.patreon,
          "profile.support_links.nonprofit": profileInfo.nonprofit,
          "profile.support_links.buymeacoffee": profileInfo.buymeacoffee,
          "profile.skillHelpOthersWith": profileInfo.skillHelpOthersWith,
          "profile.skillWantToImprove": profileInfo.skillWantToImprove
        }
      }
    );
  },

  setUserStatus: function(currentStatus) {
    check(currentStatus, String);
    if (!this.userId) {
      throw new Meteor.Error("users.methods.setUserStatus.not-logged-in", "Must be logged in.");
    }
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { statusMessage: currentStatus, statusDate: new Date() } });
  },
  setPrivacyResponse: function(isChecked) {
    check(isChecked, Boolean);
    if (!this.userId) {
      throw new Meteor.Error("users.methods.setUserStatus.not-logged-in", "Must be logged in.");
    }
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.privacyResponse": isChecked } });
    return true;
  },
  setHangoutStatus: function(hangoutStatus) {
    check(hangoutStatus, String);
    if (!this.userId) {
      throw new Meteor.Error("users.methods.setHangoutStatus.not-logged-in", "Must be logged in.");
    }
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { statusHangout: hangoutStatus } });
  },

  getHangoutsJoinedCount: function(userId) {
    check(userId, String);
    return Hangouts.find({
      users: { $elemMatch: { $eq: userId } },
      visibility: { $ne: false }
    }).count();
  }
});

/**
 * Update Emails Preferences
 * @function
 * @name updateEmailsPreference
 * @param { Object } - data
 * @return {Boolean} true on success
 */
Meteor.methods({
  updateEmailsPreference: function(data) {
    check(data, {
      emails_preference: Match.Maybe([String])
    });
    if (!this.userId) {
      throw new Meteor.Error("users.methods.updateEmailsPreference.not-logged-in", "Must be logged in.");
    }

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { emails_preference: data.emails_preference } });

    return true;
  }
});

/**
 * Update Basic Information
 * @function
 * @name updateEmailsPreference
 * @param { Object } - data
 * @return {Boolean} true on success
 */
Meteor.methods({
  updateBasicInformation: function(data) {
    check(data, {
      firstname: String,
      lastname: String,
      username: String,
      bio: String,
      skillsHelpOthersWith: String,
      skillsWantToImprove: String
    });

    const actorId = Meteor.userId();
    if (!actorId) {
      throw new Meteor.Error("users.methods.updateBasicInformation.not-logged-in", "Must be logged in.");
    }

    // Check username is unique
    const regex = new RegExp(`^${data.username}$`, "i");
    const isUsernameInUse = Meteor.users.findOne({
      _id: { $ne: actorId },
      username: regex
    });
    if (isUsernameInUse) {
      throw new Meteor.Error(
        "Users.methods.updateBasicInformation.username-is-already-in-use",
        "Username is already in user."
      );
    }

    Meteor.users.update(
      { _id: actorId },
      {
        $set: {
          username: data.username,
          "profile.firstname": data.firstname,
          "profile.lastname": data.lastname,
          "profile.bio": data.bio,
          "profile.skillHelpOthersWith": data.skillsHelpOthersWith,
          "profile.skillWantToImprove": data.skillsWantToImprove,
          "profile.complete": true
        }
      }
    );

    return true;
  }
});

/**
 * get users support link
 * @function
 * @name users.getSupportLinks
 * @param { String } - userId
 * @return {Object}
 */
Meteor.methods({
  "users.getSupportLink"(userId) {
    check(userId, String);

    const user = Meteor.users.findOne({ _id: userId }, { fields: { "profile.support_links": 1 } });
    if (user && user.profile && user.profile.support_links) {
      return user.profile.support_links;
    } else {
      return null;
    }
  }
});

/**
 * get users email Preferences
 * @function
 * @name users.getEmailPreferences
 * @param { String } - unsubscribeLinkId
 * @return { Array } - array of current preference.
 */
Meteor.methods({
  async "users.getEmailPreferences"(unsubscribeLinkId) {
    check(unsubscribeLinkId, String);

    const { recipient_id = null } = (await UnsubscribeLinks.findOne({ _id: unsubscribeLinkId })) || {};
    const user = await Meteor.users.findOne({ _id: recipient_id });

    return (user && user.emails_preference) || [];
  }
});
