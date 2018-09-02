import { HTTP } from "meteor/http";

const SLACK_USER_URL = "https://slack.com/api/users.info";

const webhooks = {
  handleNewEvent(params, req, res) {
    console.log("webhooks.handleNewEvent", req.headers);
    const { token, type, challenge, event } = req.body || {};
    const { slackAppToken } = Meteor.settings;

    if (!token || token !== slackAppToken) {
      res.statusCode = 401; // Unauthorized
      res.end();
      return;
    }

    if (type === "url_verification" && challenge) {
      res.statusCode = 200;
      res.write(challenge);
      res.end();
      return;
    }

    if (type === "event_callback" && event) {
      res.statusCode = 200;
      res.end();
      webhooks.processEvent(event);
      return;
    }
    res.statusCode = 406; // Not Acceptable
    res.end();
  },

  // First get User and it's email and it's timezone from slack API
  // Find Meteor user whos email is same as slack's one
  // If Meteor user's and slack user's have same email then create hangout
  processEvent(event) {
    console.log("webhook.processEvent", event);
    const { user: slackUserId, text, type, channel, ts } = event || {};
    if (type !== "message") return;
    const slackUser = webhooks.getSlackUser(slackUserId);
    if (!slackUser)
      return console.error("slackWebhooks.processEvent: slack user not found");
    const slackUserEmail = slackUser.profile && slackUser.profile.email;
    const slackUserTimeZone = slackUser.tz;
    if (!slackUserEmail)
      return console.error(
        "slackWebhooks.processEvent: slack user email not found"
      );
    const user = Meteor.users.findOne({ email: slackUserEmail });
    if (!user)
      return console.log("slackWebhooks.processEvent: meteor user not found");

    webhooks.createHangout(user, text);
  },

  createHangout(user, text) {
    // ToDo
    // 1. Parse the text and get hangout start/end time, title
    // 2. Create hangout
    // 3. Send message back to slack channel, hangout created Successfully
  },

  getSlackUser(slackUserId) {
    const options = {
      params: {
        user: slackUserId,
        token: Meteor.settings.slackOauthToken
      }
    };
    const response = HTTP.call("POST", SLACK_USER_URL, options);
    return response && response.data && response.data.user;
  }
};

export default webhooks;
