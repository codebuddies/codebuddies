githubAuthRevoke = function(accessToken) {
  check(accessToken, String);
  const clientId = Meteor.settings.github_clientid;
  const clientSecret = Meteor.settings.github_clientsecret;
  const options = {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    },
    data: {
      access_token: accessToken
    }
  };
  // please see the following documentation
  // https://docs.github.com/en/rest/reference/apps#delete-an-app-authorization--code-samples
  const response = HTTP.del('https://api.github.com/applications/${clientId}/grant', options);
  const { statusCode = null } = response || {};
  console.log(response); //Needed for debugging
  return {
    ok: statusCode === 204
  };
};
