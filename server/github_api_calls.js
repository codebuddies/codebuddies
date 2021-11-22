githubAuthRevoke = function(accessToken) {
  check(accessToken, String);
  const clientId = Meteor.settings.github_clientid;
  const clientSecret = Meteor.settings.github_clientsecret;
  const options = {
    headers: {
      "User-Agent": "CodeBuddies",
      "Authorization": `token ${accessToken}`
    },
    auth: `${clientId}:${clientSecret}`
  };
  const response = HTTP.del(
    "https://api.github.com/user/repos",
    options
  );
  const { statusCode = null } = response || {};
  console.log(response) //Needed for debugging
  return {
    ok: statusCode === 204
  };
};
