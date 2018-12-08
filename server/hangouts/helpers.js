import { tweetHangout } from "../twitter/methods.js";

const Helpers = {
  createHangout(data, user) {
    let group;
    //check for group
    if (data.groupId == "CB") {
      group = { _id: "CB", title: "CB", slug: "CB" };
    } else {
      const temp_item = StudyGroups.findOne({ _id: data.groupId }, { exempt_from_default_permission: 1 });

      // check for exempt_from_default_permission
      if (temp_item && temp_item.exempt_from_default_permission) {
        //check if user is a member
        if (!user || !Roles.userIsInRole(user, ["owner", "admin", "moderator", "member"], data.groupId)) {
          throw new Meteor.Error(403, "Access denied");
        } else {
          group = StudyGroups.findOne({ _id: data.groupId }, { title: 1, slug: 1 });
        }
      } else {
        //check if user has permission
        if (!user || !Roles.userIsInRole(user, ["owner", "admin", "moderator"], data.groupId)) {
          throw new Meteor.Error(403, "Access denied");
        } else {
          group = StudyGroups.findOne({ _id: data.groupId }, { title: 1, slug: 1 });
        }
      }
    } // if ends

    let createdAt = new Date();
    let createdAtPlusTwoHour = new Date(createdAt.getTime() + 2 * 1000 * 60 * 60);
    const reminder = data.start <= createdAtPlusTwoHour ? true : false;

    var hangout = {
      topic: data.topic,
      slug: data.slug,
      description: data.description,
      description_in_quill_delta: data.description_in_quill_delta,
      start: data.start,
      end: data.end,
      duration: data.duration,
      type: data.type,
      host: {
        id: user._id,
        name: user.username,
        avatar: user.profile.avatar.default
      },
      attendees: [],
      email_addresses: [user.email],
      users: [user._id],
      day_reminder_sent: reminder,
      hourly_reminder_sent: reminder,
      followup_email_sent: false,
      views: 0,
      visibility: true,
      created_at: createdAt,
      group: {
        id: group._id,
        title: group.title,
        slug: group.slug
      },
      email_notifications: {
        initial: false,
        reminder: false,
        follow_up: false
      },
      externalCheckbox: data.externalCheckbox,
      externalButtonText: data.externalButtonText,
      externalURL: data.externalURL
    };

    // console.log(hangout);

    const hangout_id = Hangouts.insert(hangout);
    hangout._id = hangout_id;

    StudyGroups.update(
      { _id: data.groupId },
      {
        $set: {
          updatedAt: new Date()
        }
      }
    );

    //tweet new hangout
    tweetHangout(hangout);
    Helpers.sendNotifications(hangout, group);
    return hangout_id;
  },

  sendNotifications(hangout, group, type = "NEW") {
    if (hangout && group) {
      let hangoutChannels = [];
      if (group._id !== "CB") {
        const studyGroup = StudyGroups.findOne({ _id: group._id }, { fields: { hangoutChannels: 1 } });
        hangoutChannels = (studyGroup && studyGroup.hangoutChannels) || [];
      }
      slackNotification(hangout, type, hangoutChannels);
      hangoutFacebookNotification(hangout, type);
    }
  },

  getUpcomingHangoutCounts(userId) {
    if (userId) {
      return Hangouts.find({
        "host.id": userId,
        end: { $gte: new Date() }
      }).count();
    } else {
      return Hangouts.find({ end: { $gte: new Date() } }).count();
    }
  }
};

export default Helpers;
