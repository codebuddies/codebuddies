import { HTTP } from "meteor/http";
import SlackAPI from "/server/slack/slack-api.js";
import Parser from "/server/slack/message-parser.js";
import moment from "moment-timezone";
import HangoutHelper from "/server/hangouts/helpers.js";

const BOT_ID = Meteor.settings.cbJarvisId;

const webhooks = {
  handleNewEvent(params, req, res) {
    const { token, type, challenge, event } = req.body || {};
    const { slackAppToken } = Meteor.settings;
    console.log("webhooks.handleNewEvent", type, event);

    if (!token || token !== slackAppToken) {
      console.log("webhooks.handleNewEvent[Unauthorized]");
      res.statusCode = 401; // Unauthorized
      res.end();
      return;
    }

    if (type === "url_verification" && challenge) {
      console.log("webhooks.handleNewEvent[url_verification]");
      res.statusCode = 200;
      res.write(challenge);
      res.end();
      return;
    }

    // Don't do anything if bot posted any message
    if (event && event.bot_id) {
      res.statusCode = 200;
      res.end();
      return;
    }

    if (type === "event_callback" && event) {
      res.statusCode = 200;
      res.end();
      webhooks.processEvent(event);
      return;
    }
    console.log("webhooks.handleNewEvent[Not Acceptable]");
    res.statusCode = 406; // Not Acceptable
    res.end();
  },

  processEvent(event) {
    console.log("webhook.processEvent");
    const { user: slackUserId, text, type, channel, ts } = event || {};
    if (type !== "message" || !text || text.indexOf(`@${BOT_ID}`) < 0) return;
    const action = Parser.parse(text);

    if (action.reply) return SlackAPI.postMessage(channel, action.reply);

    if (action.command === "create hangout")
      return webhooks.createHangout(slackUserId, action, channel);
    if (action.command === "list hangout") return webhooks.listHangout(channel);
  },

  // First get User and it's email and it's timezone from slack API
  // Find Meteor user whos email is same as slack's one
  // If Meteor user's and slack user's have same email then create hangout
  createHangout(slackUserId, action, channel) {
    const slackUser = SlackAPI.getUser(slackUserId);
    if (!slackUser)
      return console.error("slackWebhooks.processEvent[slack user not found]");
    const slackUserEmail = slackUser.profile && slackUser.profile.email;
    const slackUserTimeZone = slackUser.tz || "America/New_York";
    if (!slackUserEmail)
      return console.error(
        "slackWebhooks.processEvent[slack user email not found]"
      );

    const user = Meteor.users.findOne({ email: slackUserEmail });
    if (!user) {
      console.error("slackWebhooks.processEvent[meteor user not found]");
      return SlackAPI.postMessage(
        channel,
        "Your account not found on codebuddies.org"
      );
    }

    const duration = 25; // Default hangout 25 min
    // Use user's timezone
    const startDate = moment
      .tz(moment(action.date).format("YYYY-MM-DDTHH:mm:ss"), slackUserTimeZone)
      .startOf("minute");
    const endDate = startDate.clone().add(duration, "minutes");

    const data = {
      topic: action.title,
      slug: action.title,
      start: startDate.toDate(),
      end: endDate.toDate(),
      description: action.title + "(Created from slack)",
      duration: duration,
      type: "silent",
      groupId: "CB",
      externalCheckbox: false,
      externalButtonText: "",
      externalURL: ""
    };

    try {
      HangoutHelper.createHangout(data, user);
      let replyMsg = `Hangout created successfully for ${duration} minutes, starting from`;
      replyMsg +=
        startDate.format(" ddd, MMM Do YYYY, h:mm a ") + slackUserTimeZone;
      SlackAPI.postMessage(channel, replyMsg);
    } catch (err) {
      SlackAPI.postMessage(channel, "Ops! something went wrong.");
      console.error(err);
    }
  },

  listHangout(channel) {
    const count = HangoutHelper.getUpcomingHangoutCounts();
    SlackAPI.postMessage(channel, `${count} hangouts are scheduled currently.`);
  }
};

export default webhooks;
