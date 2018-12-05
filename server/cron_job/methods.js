import { initialEmailNotifications } from "../../imports/libs/server/cron/initial_email_notifications.js";

/**
 * Cron job function for hangout email reminders
 * @author Roberto Quezada [sgtquezada@gmail.com]
 * @version 0.0.1
 * @since 0.0.1
 *
 */
// if set to true, cron job will run every minute (production default is every 1 hour)
const debug = false;

hangoutReminder = function() {
  // only fetch hangouts with property of "is_reminder_sent: false"
  const active_hangouts = Hangouts.find({
    $or: [
      { day_reminder_sent: false, visibility: true },
      { hourly_reminder_sent: false, visibility: true },
      { followup_email_sent: false, visibility: true }
    ]
  }).fetch();

  if (active_hangouts.length > 0) {
    console.log("found a hangout to send a reminder!");

    active_hangouts.forEach(function(hangout) {
      const time_diff = parseInt((hangout.start - new Date()) / (1000 * 60 * 60));
      const time_diff_ended = parseInt((hangout.end - new Date()) / (1000 * 60 * 60));
      // console.log("time diff", time_diff);
      //console.log("time diff ended", time_diff_ended);

      // 24 hours before hangout start time alert
      if (time_diff > 2 && time_diff <= 24 && hangout.day_reminder_sent == false) {
        console.log("found a hangout for a 24-hour reminder");

        emailNotification(hangout, "REMINDER");

        // update hangout reminder to true
        Hangouts.update({ _id: hangout._id }, { $set: { day_reminder_sent: true } });
      } else if (time_diff >= 1 && time_diff < 2 && hangout.hourly_reminder_sent == false) {
        // let's alert on Slack channel and email
        console.log("found a hangout for a 2-hour reminder alert");

        // send slack alert to default channel!
        slackNotification(hangout, "REMINDER");

        // email notification
        emailNotification(hangout, "REMINDER_TWO");

        // update hourly reminder to true
        Hangouts.update({ _id: hangout._id }, { $set: { hourly_reminder_sent: true } });
      }

      if (time_diff_ended < 0 && hangout.followup_email_sent == false) {
        console.log("found a hangout that just ended");

        emailNotification(hangout, "FOLLOWUP");

        Hangouts.update({ _id: hangout._id }, { $set: { followup_email_sent: true } });
      }
    }); //end forEach
  } else {
    console.log("no active hangouts found to send reminders for! checking again in an hour...");
  }
}; // end hangoutReminder

//cron job for hangout reminders (slack and email) set for every hour by default
SyncedCron.add({
  name: "Hangouts Reminder Job",
  schedule: function(parser) {
    // set interval in settings-{environemt}.json. For production, should be set to 'every 1 hour'
    // testing
    if (debug) {
      return parser.text("Every 1 min");
    }
    return parser.text(Meteor.settings.hangout_reminder_interval);
  },
  job: function() {
    var hangoutReminderSchedule = hangoutReminder();
    return hangoutReminderSchedule;
  }
});

// cron job for email notification
SyncedCron.add({
  name: "initial email",
  schedule: function(parser) {
    // set interval in settings-{environemt}.json. For production, should be set to 'every 1 hour'
    // testing
    if (Meteor.settings.public.isModeDebug) {
      return parser.text("Every 1 min");
    }
    return parser.text("Every 40 min");
  },
  job: function() {
    var emailNotification = initialEmailNotifications();
    return emailNotification;
  }
});
