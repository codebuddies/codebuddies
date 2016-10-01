authRevoke = function(accessToken) {
  check(accessToken, String);

  var response = HTTP.get("https://slack.com/api/auth.revoke",
    {params:
      {token: accessToken,
       test: false
      }
    });
  return response.data.ok && response.data;
};
