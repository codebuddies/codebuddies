emailNotification = function(hangout, type){
  let emails = hangout.email_addresses.join(",");
  const tz = "America/Los_Angeles";
  let template_data;
  let data;
  switch (type) {
    case "REMINDER":
        SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-reminder.html'));
        template_data = {
          hangout_topic: hangout.topic,
          host: hangout.host.name,
          hangout_start_time: moment(hangout.start).tz(tz).format('MMMM Do YYYY, h:mm a z'),
          logo: Meteor.absoluteUrl('images/cb2-180.png'),
          hangout_url: Meteor.absoluteUrl("hangout/" + hangout._id)
        };

         data = {
          to: emails,
          from: Meteor.settings.email_from,
          html: SSR.render('notifyEmail', template_data),
          subject: 'CodeBuddies Alert: Hangout Reminder - ' + hangout.topic + ' is scheduled to start within 24 hours!'
        }
        console.log("data" , data);
        try{
          Email.send(data);
        }catch(e){
          throw new Meteor.Error('Hangout.hangoutReminder.emailNotification', 'Cannot send emeil notification');
        }

      break;
    case "DELETED":
        SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-alerts.html'));
        let emails = hangout.email_addresses.join(",");
        template_data = {
          hangout_topic: hangout.topic,
          host: hangout.host.name,
          hangout_start_time: moment(hangout.start).tz(tz).format('MMMM Do YYYY, h:mm a z'),
          logo: Meteor.absoluteUrl('images/cb2-180.png')
        };

        data = {
          to: emails,
          from: Meteor.settings.email_from,
          html: SSR.render('notifyEmail', template_data),
          subject: 'CodeBuddies Alert: Hangout - ' + hangout.topic + ' has been CANCELLED'
        }

        try {
        Email.send(data);
        } catch ( e ) {
        return false;
        }

      break;
    default:
  }
}
