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
    channel: Meteor.settings.slack_alert_channel,
    icon_emoji: ':bell:',
    username: Meteor.settings.slack_alert_username
});

slackNotification = function(hangout, type){

  let fallback, pretext;

  if(type === "REMINDER"){
     fallback = `Reminder! hangout: ${hangout.topic} is set to start on ${hangout.start_time}. Visit` + Meteor.absoluteUrl("hangout/" + hangout._id);
     pretext = `Reminder! ${hangout.type} hangout: *${hangout.topic}* scheduled by <@${hangout.host.name}> is set to start in *less than two hours!*`;
  }
  if(type === "NEW"){
     fallback = 'A new hangout has been scheduled. Visit' + Meteor.absoluteUrl('hangout/' + hangout._id);
     pretext = `A new *${hangout.type}* hangout has been scheduled by <@${hangout.host.name}>!`;
  }

  let data = {
     attachments: [{
       fallback: fallback,
       color: '#1e90ff',
       pretext: pretext,
       title: `${hangout.topic.substr(0,101) + '...'}`,
       title_link: Meteor.absoluteUrl("hangout/" + hangout._id),
       mrkdwn_in: ['text', 'pretext', 'fields'],
       fields: [{
         title: 'Description',
         value: `_ ${hangout.description.substr(0,201) + '...'} _`,
         short: true
       },{
         title: 'Date',
         value: `${moment.utc(hangout.start).format('MMMM Do YYYY, h:mm a z')}`,
         short: true
       }]
    }]
  }//data

  hangoutAlert(data)

}//slackNotification();
