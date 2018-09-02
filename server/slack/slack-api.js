// This slack web API is for the workspace apps
// https://api.slack.com/workspace-apps-preview

import { HTTP } from "meteor/http";

const URLS = {
  USER_INFO: "https://slack.com/api/users.info"
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
  }
};

export default SlackAPI;
