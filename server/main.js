import md5 from 'md5';


Meteor.startup(function() {
 // fire off cron jobs
  SyncedCron.start();

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

let filterForSlackLogins = (user) => {
    const username = user.name;
    const profile = {
      time_zone: user.tz,
      time_zone_label: user.tz_label,
      time_zone_offset: user.tz_offset,
      firstname: user.profile.first_name,
      lastname: user.profile.last_name,
      avatar: {
        default: user.profile.image_72,
        image_192: user.profile.image_192,
        image_512: user.profile.image_512
      }
    }
    const email = user.profile.email;

    return filterdFields = {
      username: username,
      profile: profile,
      email : email
    }
}

let generateGravatarURL = (email) => {
  const gravatarHash = md5(email.toLowerCase());
  return{
    default : Meteor.settings.root_gravatar + gravatarHash + '?size=72',
    image_192 : Meteor.settings.root_gravatar + gravatarHash + '?size=192',
    image_512 : Meteor.settings.root_gravatar + gravatarHash + '?size=512'
  }
}


Accounts.onCreateUser(function(options, user) {

  if (user.services.slack){
    Roles.setRolesOnUserObj(user, ['user']);
    const user_info = loggingInUserInfo(user);
    const pickField = filterForSlackLogins(user_info.user)

    if(Meteor.settings.isModeProduction){
      const email = pickField.email;
      const merge_vars = {
          "FNAME": pickField.profile.firstname,
          "LNAME": pickField.profile.lastname,
          "TZ": pickField.profile.time_zone,
          "TZ_LABEL": pickField.profile.time_zone_label,
          "TZ_OFFSET": pickField.profile.time_zone_offset,
          "USERNAME": pickField.username
      }

      addUserToMailingList(email,merge_vars);
    }

    user.username = pickField.username;
    user.profile = pickField.profile;
    user.email = pickField.email;
    return user;
  }

  if(user.services.password){
    const avatar = generateGravatarURL(options.email);
    const profile = {
      avatar:avatar
    }

    user.username = user.username;
    user.profile = profile;
    user.email = options.email;
    return user;
  }

});
