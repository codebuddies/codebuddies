/** 
 * @file CB custom functions globally available across the app (client and server)
 * 
 */
 
 
 
 /** 
  * Slack Notify function
  * leveraging the package <georgediab:slack-notify>
  * @see https://atmospherejs.com/georgediab/slack-notify
  * 
  * @author Roberto Quezada [sgtquezada@gmail.com]
  * @version 0.0.1
  * @since 0.0.1
  */
  
  
  /** 
   * @param {string} message - the message to deliver. 
   * @param {string} channel - channel to post message to
   * @param {string} type - "new-hangout" or 
   */
   
slackNotify = (message) => {
      
      slack.send({
          username: 'CodeBuddies Alerts',
          channel: '#cb2-test',
          message: message,
          icon_emoji: ':bell:'
      });
 
  }  
  
