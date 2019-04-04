import SlackAPI from "/server/slack/slack-api.js";
import HangoutHelper from "/server/hangouts/helpers.js";
import LearningHelper from "/server/learnings/helpers.js";
import Helpers from "/server/slack/helpers.js";

const MAX_ALLOWED_HANGOUT_PER_DAY = 5;
const DEFAULT_DURATION = 25; // Default hangout duration in minutes

const Actions = {
  handleHowAreYou(channel) {
    SlackAPI.postMessage(channel, "I'm good.");
  },

  handleHelp(channel, segments) {
    const message = `Supported Actions: #createHangout, #listHangouts, #TIL.
      Examples:
      "#createHangout tomorrow at 6 pm, YOUR HANGOUT TITLE"
      "#createHangout today from 9 to 10pm, teaching intermediate git for practice"
      "#createHangout next sunday from 7:30 to 9 pm, pairing on algorithms",
      "#createHangout in 2 hours, studying python from the Official Python tutorial"
      "#til #Django crispy forms rocks! https://django-crispy-forms.readthedocs.io/en/latest/ #Python #WebDev"
    `;

    if (segments && segments[0]) {
      if (segments[0] === "who is the strongest avenger?") {
        return SlackAPI.postMessage(
          channel,
          "Thor. Although stronger than most of his mortal teammates, Thor is far from the strongest Avenger."
        );
      }
    }

    SlackAPI.postMessage(channel, message);
  },

  handleListHangout(channel) {
    const count = HangoutHelper.getUpcomingHangoutCounts();
    SlackAPI.postMessage(channel, `${count} hangouts are scheduled currently.`);
  },

  // First get User and its email and timezone from Slack API
  // Find Meteor user whos email is same as slack's one
  // If Meteor user's and slack user's have same email then create hangout
  handleCreateHangout(slackUserId, channel, segments) {
    const slackUser = SlackAPI.getUser(slackUserId);
    if (!slackUser) return console.error("slackWebhooks.processEvent[slack user not found]");
    const slackUserEmail = slackUser.profile && slackUser.profile.email;
    const slackUserTimeZone = slackUser.tz || "America/New_York";
    if (!slackUserEmail) return console.error("slackWebhooks.processEvent[slack user email not found]");

    const user = Meteor.users.findOne({ email: slackUserEmail });
    if (!user) {
      console.error("slackWebhooks.processEvent[meteor user not found]");
      return SlackAPI.postMessage(channel, "Your account was not found on codebuddies.org");
    }

    const totalHangouts = HangoutHelper.getUpcomingHangoutCounts(user._id);
    const limitExceeded = totalHangouts >= MAX_ALLOWED_HANGOUT_PER_DAY;
    const isProduction = Meteor.settings.isModeProduction;

    if (limitExceeded && isProduction) {
      return SlackAPI.postMessage(channel, "You are not allowed to create more hangouts today.");
    }

    if (!segments[0]) {
      const message = "Date is required for hangout. (eg: #createHangout tomorrow at 6 pm, YOUR HANGOUT TITLE)";
      return SlackAPI.postMessage(channel, message);
    }

    if (!segments[1]) {
      const message = "Title is required for hangout. (eg: #createHangout tomorrow at 6 pm, YOUR HANGOUT TITLE)";
      return SlackAPI.postMessage(channel, message);
    }

    const { start, end } = Helpers.getDate(segments[0]);

    if (!start) {
      return SlackAPI.postMessage(channel, "Date unrecognized. Please try again.");
    }

    const startString = moment(start).format("YYYY-MM-DDTHH:mm:ss");
    const endString = end
      ? moment(end).format("YYYY-MM-DDTHH:mm:ss")
      : moment(start)
          .add(DEFAULT_DURATION, "minutes")
          .format("YYYY-MM-DDTHH:mm:ss");

    // Use user's timezone
    const startDate = moment.tz(startString, slackUserTimeZone).startOf("minute");
    const endDate = moment.tz(endString, slackUserTimeZone).startOf("minute");
    const duration = endDate.diff(startDate, "minutes");

    const data = {
      topic: segments[1],
      slug: segments[1],
      start: startDate.toDate(),
      end: endDate.toDate(),
      description: segments[1] + " (Created via Slack)",
      duration: duration,
      type: "silent",
      groupId: "CB",
      externalCheckbox: false,
      externalButtonText: "",
      externalURL: ""
    };

    try {
      const hangoutId = HangoutHelper.createHangout(data, user);
      const hangoutUrl = Meteor.absoluteUrl("hangout/" + hangoutId);
      const time = startDate.format("ddd, MMM Do YYYY, h:mm A (z)");

      let replyMsg = `Hangout created successfully! It will last for ${duration} minutes, starting from :calendar: ${time}.`;
      replyMsg += `\n Go to ${hangoutUrl} to edit or join the hangout.`;

      SlackAPI.postMessage(channel, replyMsg);
    } catch (err) {
      SlackAPI.postMessage(channel, "Oops! something went wrong.");
      console.error(err);
    }
  },

  handleTIL(slackUserId, channel, segments) {
    const TOPIC_LEN = 300;
    const concatTopic = segments.join(", ").trim();
    const topic = Helpers.removeFormatting(concatTopic);

    if (!topic) {
      return SlackAPI.postMessage(channel, "Please share something you learned. Try again.");
    }

    if (topic.length > TOPIC_LEN) {
      const message = `Please keep the message to no more than ${TOPIC_LEN} characters. Current length: ${
        topic.length
      }`;
      return SlackAPI.postMessage(channel, message);
    }

    const slackUser = SlackAPI.getUser(slackUserId);
    if (!slackUser) {
      return console.error("slackWebhooks.processEvent[slack user not found]");
    }
    const slackUserEmail = slackUser.profile && slackUser.profile.email;
    const user = Meteor.users.findOne({ email: slackUserEmail });
    if (!user) {
      console.error("slackWebhooks.processEvent[meteor user not found]");
      return SlackAPI.postMessage(channel, "Your account was not found on codebuddies.org");
    }

    LearningHelper.addLearning({
      title: topic,
      user_id: user._id,
      username: user.username
    });

    const url = Meteor.absoluteUrl("/learnings");
    SlackAPI.postMessage(channel, `Thank you for sharing something you learned/a win! It has been archived on ${url}.`);
  }
};

export default Actions;
