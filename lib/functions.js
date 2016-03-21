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


hangoutAlert = slack.extend({
    channel: '#cb2-test',
    icon_emoji: ':bell:',
    username: 'CodeBuddies Alerts'
  });
