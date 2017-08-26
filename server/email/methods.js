emailNotification = function(hangout, type){
  let emails = hangout.email_addresses.join(",");
  console.log(emails + ' are the emails that we are sending to in emailNotification');
  let subject;
  if(type === "REMINDER"){
     SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-reminder.html'));
     subject = 'Hangout Reminder - ' + hangout.topic + ' is scheduled to start within 24 hours!';
  }
  if(type === "REMINDER_TWO"){
     SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-reminder-two.html'));
     subject = 'Hangout Reminder - ' + hangout.topic + ' is scheduled to start within 2 hours!';
  }
  if(type === "DELETED"){
    SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-alerts.html'));
    subject = 'Hangout "' + hangout.topic + '" has been CANCELLED';
  }
  if(type === "FOLLOWUP"){
    SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-followup.html'));
    subject = 'What did you learn during "' + hangout.topic + '"?';
  }

  const template_data = {
    hangout_topic: hangout.topic,
    host: hangout.host.name,
    hangout_start_time: moment.utc( hangout.start ).format('MMMM Do YYYY, h:mm a z'),
    logo: Meteor.absoluteUrl('images/logo-circle.png'),
    hangout_url: Meteor.absoluteUrl("hangout/" + hangout._id)
  };

   const data = {
    to: emails,
    from: Meteor.settings.email_from,
    html: SSR.render('notifyEmail', template_data),
    subject: subject,
  }

    try {
     Email.send(data);
    } catch ( e ) {
      return false;
    } finally {
      return true;
    }
}
