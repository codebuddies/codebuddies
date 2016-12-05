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

  let date_start, now_value, now_formatted_time, difference, minutes;
  date_start = moment.utc(hangout.start);
  now_value = (moment.utc()); //.format('MMMM Do YYYY, h:mm a z');
  hangout_formatted_time = (moment.utc(hangout.start)).format('MMMM Do YYYY, h:mm a z');
  now_formatted_time = (moment.utc()).format('MMMM Do YYYY, h:mm a z');
  difference = (moment.duration(date_start.diff(now_value)));
  minutes = difference.asMinutes();
  if (minutes < 0) { // this is to protect from time being in the past (negative number)
    minutes = Math.abs(minutes) + minutes;
    // console.log("this was negative and changed it to: " + minutes);
  }
  if (minutes  >= 60){
     var hours_whole = difference.asHours();
     var hours = Math.floor(hours_whole);
     var rem = Math.floor((minutes - hours*60));
     var days_whole = difference.asDays();
     var days = Math.floor(days_whole);
     var rem_hours = Math.floor((hours_whole - days*24));

     if(hours == 1){   //Singular
         var time_left = 'Starts in '+hours +' hr & '+rem+' mins!';
     }
     else if(hours > 1 && hours < 24 ) {    //Plural
         var time_left = 'Starts in '+hours +' hrs & '+rem+' mins!';
     }

     else if(hours >=24 && days == 1){
         var time_left = 'Starts in '+days +' day, '+rem_hours+' hrs & '+rem+' mins!';
     }
     else if(hours >=24 && days > 1){
       var time_left = 'Starts in '+days +' days, '+rem_hours+' hrs & '+rem+' mins!';
     }
  }

  else if (minutes >=0 && minutes < 60){
     var rem = Math.floor(minutes);

     if(minutes >= 0 && minutes < 1)
     {
       var time_left = 'Hangout starts now!';
     }
     else {
       var time_left = 'Starts in '+(rem+1)+' mins!';
     }
  }

  let hangoutTitle, hangoutDescription;
  hangoutTitle = hangout.topic;
  hangoutDescription = hangout.description;

  if(hangoutTitle.length > 101){
    hangoutTitle = `${hangoutTitle.substr(0,101) + '...'}`;
  }
  else {
    hangoutTitle.substr(0,101);
  }

  if(hangoutDescription.length > 201){
    hangoutDescription = `${hangout.description.substr(0,201) + '...'}`;
  }
  else {
    hangoutDescription = `_ ${hangoutDescription.substr(0,201)} _`;
  }

  let data = {
     attachments: [{
       fallback: fallback,
       color: '#1e90ff',
       pretext: pretext,
       title: hangoutTitle,
       title_link: Meteor.absoluteUrl("hangout/" + hangout._id),
       mrkdwn_in: ['text', 'pretext', 'fields'],
       fields: [{
         title: 'Description',
         value: hangoutDescription,
         short: true
       },{
         title: 'Date',
         value: `${hangout_formatted_time + '\n ('+time_left+')'}`,
         short: true
       }]
    }]
  }//data

  if(minutes >= 0)
  {
  hangoutAlert(data)
  }
}//slackNotification();
