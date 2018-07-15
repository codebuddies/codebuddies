githubAuthRevoke = function(accessToken) {
  check(accessToken, String);
  const clientId = Meteor.settings.github_clientid;
  const clientSecret = Meteor.settings.github_clientsecret;
  const options = {
    headers: {
      "User-Agent": "CodeBuddies"
    },
    auth: `${clientId}:${clientSecret}`
  };
  const response = HTTP.del(
    `https://api.github.com/applications/${clientId}/grants/${accessToken}`,
    options
  );
  const { statusCode = null } = response || {};
  return {
    ok: statusCode === 204
  };
};
