/**
 * @file CB custom functions globally available across the app (client and server)
 *
 */


 /**
  * Slack Notify custom CB function
  * leveraging the package <georgediab:slack-notify>
  * @see https://atmospherejs.com/georgediab/slack-notify
  *
  * @author Roberto Quezada [sgtquezada@gmail.com]
  * @version 0.0.1
  * @since 0.0.1
  */

if (Meteor.isServer) {
hangoutAlert = slack.extend({
    channel: Meteor.settings.slack_alert_channel,
    icon_emoji: ':bell:',
    username: Meteor.settings.slack_alert_username
  });

/**
 * Cron job function for hangout email reminders
 * @author Roberto Quezada [sgtquezada@gmail.com]
 * @version 0.0.1
 * @since 0.0.1
 *
 */

hangoutReminder = function () {
    var active_hangouts = Hangouts.find( {start: { $gt: new Date() } }).fetch();
    active_hangouts.forEach(function(hangout){
      let tz = "America/Los_Angeles";  // default to PT timezone to remain consistent
      let id = hangout._id;
      let now = moment();
      let start_time_iso = moment(hangout.start);
      let hangout_start_time = moment(hangout.start).tz(tz).format('MMMM Do YYYY, h:mm a z');
      let hangout_topic = hangout.topic;
      let hangout_desc = hangout.description;
      let hangout_type = hangout.type;
      let host = hangout.creator;
      let emails = hangout.email_addresses.join(",");
      let time_diff = start_time_iso.diff(now, 'hours'); // will return time difference in hours. e.g "24" or "2"
      // console.log ("hangout : " + hangout.topic + " has a time diff of: " + time_diff);

      // 2 hours before hangout start time alert
      if (time_diff <= 2) { // let's alert on Slack channel and email

        var data = {
          attachments: [
            {
              fallback: `Reminder! hangout: ${hangout_topic} is scheduled to start on ${hangout_start_time}. Visit` + Meteor.absoluteUrl("hangout/"+id),
              color: '#1e90ff',
              pretext: `Reminder! ${hangout_type} hangout: *${hangout_topic}* scheduled by <@${host}> is set to start in two hours or less!`,
              title: `${hangout_topic}`,
              title_link: Meteor.absoluteUrl("hangout/"+id),
              mrkdwn_in: ['text', 'pretext', 'fields'],
              fields: [
                {
                  title: 'Description',
                  value: `_${hangout_desc}_`,
                  short: true
                },
                {
                  title: 'Date',
                  value: `${hangout_start_time}`,
                  short: true
                }
                ]
            }
            ]
        }
        // send slack alert to default channel!
        hangoutAlert(data);

      } else if (time_diff = 24) {
        // let's do an email reminder only for 24 hours
        SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-reminder.html'));
        var template_data = {
          hangout_topic: hangout_topic,
          host: host,
          hangout_start_time: hangout_start_time,
          logo: Meteor.absoluteUrl('images/cb2-180.png'),
          hangout_url: Meteor.absoluteUrl("hangout/"+id)
        };

        var data = {
          to: emails,
          from: Meteor.settings.email_from,
          html: SSR.render('notifyEmail', template_data),
          subject: 'CodeBuddies Alert: Hangout Reminder - ' + hangout_topic + ' is scheduled to start within 24 hours!'
        }
        // let's send the email now!
        Email.send(data);

      }
    })

  }

  //cron job for hangout reminders (slack and email) set for every hour by default
  SyncedCron.add({
    name: 'Hangouts Reminder Job',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    },
    job: function() {
      var hangoutReminderSchedule = hangoutReminder();
      return hangoutReminderSchedule;
    }
  });
}
