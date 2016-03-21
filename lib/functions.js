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


  /**
   * @param {string} message - the message to deliver.
   * @param {string} channel - slack channel to post message to
   * @param {string} type - "new" or 'reminder'  -- TODO: need to add this
   */

slackNotify = (message, channel = '#news') => {

      slack.send({
          username: 'CodeBuddies Alerts',
          channel: channel,
          text: message,
          icon_emoji: ':bell:'
      });

  }
