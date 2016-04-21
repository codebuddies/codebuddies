Meteor.startup(function() {

  Accounts.loginServiceConfiguration.remove({
    service : 'slack'
  });

  Accounts.loginServiceConfiguration.insert({
    service     : 'slack',
    "clientId" : Meteor.settings.slack_clientid,
    "secret" : Meteor.settings.slack_clientsecret,
    "loginStyle" : "popup"
  });

  smtp = {
    username: Meteor.settings.mailgun_username,
    password: Meteor.settings.mailgun_password,
    server: Meteor.settings.mailgun_host,
    port: Meteor.settings.mailgun_port
  }

  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

  if(Meteor.users.find().count()===0){

      var password = Random.secret([9]);
      var id = Accounts.createUser({
        username : Meteor.settings.root_username,
        email : Meteor.settings.root_email,
        password : password
      })
      if(id){
        Roles.addUsersToRoles(id, 'admin');
        Email.send({
          to: Meteor.settings.root_email,
          from: Meteor.settings.email_from,
          subject: "With great power comes great responsibility",
          text: password
        });
      }

    }


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
  console.log("user",user);
  //setting user role on first sign in
  if(Meteor.users.find().count()!==0)
  Roles.setRolesOnUserObj(user, ['user']);

  if (options.profile){
    Roles.setRolesOnUserObj(user, ['user']);
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
  }else if(Meteor.settings.root_username === user.username &&  Meteor.settings.root_email === user.emails[0].address ){
    var profile_info = {
      name:user.username,
      gravatar : Meteor.settings.root_gravatar,
    }
    var user_info = {
      profile:{email:options.email}
    }
    user.user_info = user_info;
    user.statusMessage = '';
    user.statusDate = '';
    user.statusHangout = '';
    user.profile = profile_info;
    return user;
  }
});
