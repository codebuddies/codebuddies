Meteor.startup(function() {

  Accounts.loginServiceConfiguration.remove({
    service : 'slack'
  });

  Accounts.loginServiceConfiguration.insert({
    service     : 'slack',
    "clientId" : "4364220508.19931575810",
    "secret" : "1f444a99afd6ee81a67197229c5a2b27",
    "loginStyle" : "popup"
  });

});

var loggingInUserInfo = function(user) {
  var response = HTTP.get("https://slack.com/api/users.info",
    {params:
      {token: user.services.slack.accessToken,
       user: user.services.slack.id,
       scope: "users:read"
      }
    });
  return response.data.ok && response.data;
};

var getUserIdentity = function(user) {
  var response = HTTP.get("https://slack.com/api/auth.test",
    {params:
      {token: user.services.slack.accessToken}
    });
  return response.data.ok && response.data;
}

Accounts.onCreateUser(function(options, user) {
  var identity = getUserIdentity(user);
  var user_info = loggingInUserInfo(user);
  var profile_info = {
    name: identity.user,
    url: identity.url,
    team: identity.team,
    user_id: identity.user_id,
    team_id: identity.team_id
  }
  user.statusMessage = '';
  user.statusDate = '';
  user.statusHangout = '';
  user.user_info = user_info.user;
  user.profile = profile_info;

  return user;
});
