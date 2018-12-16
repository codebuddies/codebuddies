import moment from "moment-timezone";
import Commands from "/server/slack/commands.js";
import Helpers from "/server/slack/helpers.js";
import Actions from "/server/slack/actions.js";

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
    if (!text || type !== "message") return;
    const { command, segments } = Helpers.getCommandAndSegments(text);

    if (Commands.HELP.includes(command)) {
      return Actions.handleHelp(channel, segments);
    }

    if (Commands.HOW_ARE_YOU.includes(command)) {
      return Actions.handleHowAreYou(channel);
    }

    if (Commands.TIL.includes(command)) {
      return Actions.handleTIL(slackUserId, channel, segments);
    }

    if (Commands.CREATE_HANGOUT.includes(command)) {
      return Actions.handleCreateHangout(slackUserId, channel, segments);
    }

    if (Commands.LIST_HANGOUTS.includes(command)) {
      return Actions.handleListHangout(channel);
    }
  },

  handleNewCommand(params, req, res) {
    const { token, channel_id, user_id, command, text } = req.body || {};
    const { slackAppToken } = Meteor.settings;
    console.log("webhooks.handleNewCommand", command, text);

    if (!token || token !== slackAppToken) {
      console.log("webhooks.handleNewCommand[Unauthorized]");
      res.statusCode = 401; // Unauthorized
      res.end();
      return;
    }

    const segments = text
      .trim()
      .split(",")
      .map(item => item.trim())
      .filter(Boolean);

    if (Commands.HELP.includes(command)) {
      Actions.handleHelp(channel_id, segments);
    }

    if (Commands.HOW_ARE_YOU.includes(command)) {
      Actions.handleHowAreYou(channel_id);
    }

    if (Commands.TIL.includes(command)) {
      Actions.handleTIL(user_id, channel_id, segments);
    }

    if (Commands.CREATE_HANGOUT.includes(command)) {
      Actions.handleCreateHangout(user_id, channel_id, segments);
    }

    if (Commands.LIST_HANGOUTS.includes(command)) {
      Actions.handleListHangout(channel_id);
    }

    res.statusCode = 200;
    res.end();
  }
};

export default webhooks;
