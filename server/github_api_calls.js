githubAuthRevoke = function(accessToken) {
  console.log('testing github')
  check(accessToken, String);
  const clientId = Meteor.settings.github_clientid;
  const clientSecret = Meteor.settings.github_clientsecret;

  // Requesting a user's GitHub identity
  try {
  const response = HTTP.get(
    "https://github.com/login/oauth/authorize/",
    {client_id: clientId, redirect_uri: "https://codebuddies.org/_oauth/github"}
  );
  console.log('response', response)
  } catch(e) {
    console.log(e)
    return false;
  }

  // After users are redirected back to the site by GitHub
  try {
    const { code } = response;
    console.log('code', code);
    const response = HTTP.post(
      "https://github.com/login/oauth/access_token",
      {client_id: clientId, client_secret: clientSecret, code}
    );
  } catch(e) {
    console.log(e);
    return false;
  }

  return {
    ok: statusCode === 204
  };
};
