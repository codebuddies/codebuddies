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

  slackNotification = function(hangout, type){
    const tz = "America/Los_Angeles";
    let data;
    switch (type) {
      case "REMINDER":
       data = {
              attachments: [{
                  fallback: `Reminder! hangout: ${hangout.topic} is set to start on ${hangout.start_time}. Visit` + Meteor.absoluteUrl("hangout/" + hangout._id),
                  color: '#1e90ff',
                  pretext: `Reminder! ${hangout.type} hangout: *${hangout.topic}* scheduled by <@${hangout.host.name}> is set to start in *less than two hours!*`,
                  title: `${hangout.topic}`,
                  title_link: Meteor.absoluteUrl("hangout/" + hangout._id),
                  mrkdwn_in: ['text', 'pretext', 'fields'],
                  fields: [{
                      title: 'Description',
                      value: `_ ${hangout.desc} _`,
                      short: true
                  }, {
                      title: 'Date',
                      value: `${hangout.start}`,
                      short: true
                  }]
              }]
          }
          hangoutAlert(data)
        break;
      case "NEW":
       data = {
        attachments: [
            {
              fallback: 'A new hangout has been scheduled. Visit' + Meteor.absoluteUrl('hangout/' + hangout._id) ,
              color: '#1e90ff',
              pretext: `A new *${hangout.type}* hangout has been scheduled by <@${hangout.host.name}>!`,
              title: `${hangout.topic}`,
              title_link: Meteor.absoluteUrl("hangout/" + hangout._id),
              mrkdwn_in: ['text', 'pretext', 'fields'],
              fields: [
                {
                  title: 'Description',
                  value: `_${hangout.desc}_`,
                  short: true
                },
                {
                  title: 'Date',
                  value: `${hangout.start}`,
                  short: true
                }
                ]
            }
            ]

          }
      hangoutAlert(data)
        break;
      default:
    }

  }


    /**
     * Cron job function for hangout email reminders
     * @author Roberto Quezada [sgtquezada@gmail.com]
     * @version 0.0.1
     * @since 0.0.1
     *
     */
    // if set to true, cron job will run every minute (production default is every 1 hour)
    let debug = true;

    hangoutReminder = function() {
            // only fetch hangouts with property of "is_reminder_sent: false"
            var active_hangouts = Hangouts.find({
              $or: [{day_reminder_sent: false}, {hourly_reminder_sent: false}]
            }).fetch();

            if (active_hangouts.length > 0) {
              console.log("found a hangout to send a reminder!");
                active_hangouts.forEach(function(hangout) {

                        let now = moment();
                        let start_time_iso = moment(hangout.start);
                        let time_diff = start_time_iso.diff(now, 'hours'); // will return time difference in hours. e.g "24" or "2"

                        // 24 hours before hangout start time alert
                        if (time_diff <= 24 && hangout.day_reminder_sent == false) {
                          console.log("found a hangout for a 24 hour reminder");

                            emailNotification(hangout, "REMINDER");

                            // update hangout reminder to true
                            Hangouts.update({_id: hangout._id},
                                            {$set: { day_reminder_sent: true}});

                        }  else if (time_diff <= 2 && hangout.hourly_reminder_sent == false) { // let's alert on Slack channel and email
                            console.log("found a hangout for a 2 hour slack reminder alert");

                            // send slack alert to default channel!
                            slackNotification(hangout, "REMINDER");

                            // update hourly reminder to true
                            Hangouts.update({_id: hangout._id},
                                            {$set: {hourly_reminder_sent: true}});

                        }
                    }) //end forEach
            } else {
                console.log("no active hangouts found to send reminders for! checking again in an hour...");
            }
        } // end hangoutReminder

    //cron job for hangout reminders (slack and email) set for every hour by default
    SyncedCron.add({
        name: 'Hangouts Reminder Job',
        schedule: function(parser) {
            // set interval in settings-{environemt}.json. For production, should be set to 'every 1 hour'
            // testing
            if (debug) {
              return parser.text('Every 1 min');
            }
              return parser.text(Meteor.settings.hangout_reminder_interval);
        },
        job: function() {
            var hangoutReminderSchedule = hangoutReminder();
            return hangoutReminderSchedule;
        }
    });
}
