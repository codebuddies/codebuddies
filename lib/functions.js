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
}