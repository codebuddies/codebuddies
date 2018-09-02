import { HTTP } from "meteor/http";
import SlackAPI from "/server/slack/slack-api.js";
import Parser from "/server/slack/message-parser.js";

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

  // First get User and it's email and it's timezone from slack API
  // Find Meteor user whos email is same as slack's one
  // If Meteor user's and slack user's have same email then create hangout
  processEvent(event) {
    console.log("webhook.processEvent");
    const { user: slackUserId, text, type, channel, ts } = event || {};
    if (type !== "message" || !text || text.indexOf(`@${BOT_ID}`) < 0) return;
    const action = Parser.parse(text);

    if (action.reply) {
      SlackAPI.postMessage(channel, action.reply);
    }

    if (action.command === "create hangout") {
      const slackUser = SlackAPI.getUser(slackUserId);
      if (!slackUser)
        return console.error(
          "slackWebhooks.processEvent[slack user not found]"
        );
      const slackUserEmail = slackUser.profile && slackUser.profile.email;
      const slackUserTimeZone = slackUser.tz;
      if (!slackUserEmail)
        return console.error(
          "slackWebhooks.processEvent[slack user email not found]"
        );
      const user = Meteor.users.findOne({ email: slackUserEmail });
      if (!user)
        return console.error(
          "slackWebhooks.processEvent[meteor user not found]"
        );
      webhooks.createHangout(user, text, channel);
    }

    if (action.command === "list hangout") {
    }
  },

  createHangout(user, text, channel) {
    //console.log("webhooks.createHangout", text, channel);
    //SlackAPI.postMessage(channel, "webhooks.createHangout");
    // ToDo
    // 1. Parse the text and get hangout start/end time, title
    // 2. Create hangout
    // 3. Send message back to slack channel, hangout created Successfully
  }
};

export default webhooks;
