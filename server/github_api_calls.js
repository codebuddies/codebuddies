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
    console.log('response after requesting a GitHub identity', response)
    // After users are redirected back to the site by GitHub
    try {
      const { code } = response;
      console.log('code returned', code);
      const response = HTTP.post(
        "https://github.com/login/oauth/access_token",
        {client_id: clientId, client_secret: clientSecret, code}
      );
      console.log('response after users are redirected back to the site by GitHub', response)
    } catch(e) {
      console.log("After users are redirected back to the site by GitHub", e);
      return false;
    }
  } catch(e) {
    console.log(e)
    return false;
  }



  return {
    ok: statusCode === 204
  };
};
