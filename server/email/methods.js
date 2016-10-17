emailNotification = function(hangout, type){
  let emails = hangout.email_addresses.join(",");
  let subject;
  if(type === "REMINDER"){
     SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-reminder.html'));
     subject = 'CodeBuddies Alert: Hangout Reminder - ' + hangout.topic + ' is scheduled to start within 24 hours!';
  }
  if(type === "DELETED"){
    SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-alerts.html'));
    subject = 'CodeBuddies Alert: Hangout - ' + hangout.topic + ' has been CANCELLED';
  }

  const template_data = {
    hangout_topic: hangout.topic,
    host: hangout.host.name,
    hangout_start_time: moment.utc( hangout.start ).format('MMMM Do YYYY, h:mm a z'),
    logo: Meteor.absoluteUrl('images/logo.svg'),
    hangout_url: Meteor.absoluteUrl("hangout/" + hangout._id)
  };

   const data = {
    to: emails,
    from: Meteor.settings.email_from,
    html: SSR.render('notifyEmail', template_data),
    subject: subject,
  }

//this is a function that will throw an error if the email function does not send properly
    try {
     Email.send(data);
    } catch ( e ) {
      return false;
    } finally {
      return true;
    }
}
