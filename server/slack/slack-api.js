// This slack web API is for the workspace apps
// https://api.slack.com/workspace-apps-preview

import { HTTP } from "meteor/http";

const URLS = {
  USER_INFO: "https://slack.com/api/users.info",
  POST_MESSAGE: "https://slack.com/api/chat.postMessage",
  SLACK_INVITE: "https://slack.com/api/users.admin.invite"
};

const SlackAPI = {
  getUser(slackUserId) {
    const options = {
      params: {
        user: slackUserId,
        token: Meteor.settings.slackOauthToken
      }
    };
    const response = HTTP.call("POST", URLS.USER_INFO, options);
    return response && response.data && response.data.user;
  },

  postMessage(channel, text) {
    const options = {
      params: {
        token: Meteor.settings.slackOauthToken,
        channel: channel,
        text: text
      }
    };
    const response = HTTP.call("POST", URLS.POST_MESSAGE, options);
    const { ok, error } = (response && response.data) || {};
    console.log("SlackAPI.postMessage[response]:", { ok, error });
    return response.data;
  },

  inviteUser(email) {
    const SLACK_TOKEN = Meteor.settings.slackOauthToken;
    const QUERY_PARAMS = `email=${email}&token=${SLACK_TOKEN}&set_active=true`;
    const slackInviteUseUrl = `${URLS.SLACK_INVITE}?${QUERY_PARAMS}`;
    const response = HTTP.call("GET", slackInviteUseUrl);
    return response.data;
  }
};

export default SlackAPI;
