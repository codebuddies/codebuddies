/**
 * Slack Notify custom CB function
 * leveraging the package <georgediab:slack-notify>
 * @see https://atmospherejs.com/georgediab/slack-notify
 *
 * @author Roberto Quezada [sgtquezada@gmail.com]
 * @version 0.0.1
 * @since 0.0.1
 */

hangoutChannelAlert = function(channel) {
  return slack.extend({
    channel: channel,
    icon_emoji: ":bell:",
    username: Meteor.settings.slack_alert_username
  });
};

hangoutAlert = hangoutChannelAlert(Meteor.settings.slack_alert_channel);

slackNotification = function(hangout, type, hangoutChannels) {
  let fallback, pretext;

  let attendees_list = hangout.attendees;

  let nameString = "";
  if (attendees_list.length == 1) {
    nameString += "<@" + attendees_list[0]["name"] + "> has RSVPed!";
  } else if (attendees_list.length == 2) {
    nameString =
      "<@" +
      attendees_list[0]["name"] +
      "> and <@" +
      attendees_list[1]["name"] +
      "> have RSVPed!";
  } else {
    attendees_list.forEach(function(element) {
      if (element !== attendees_list[attendees_List.length - 1]) {
        nameString += "<@" + element.name + ">, ";
      } else if (element == attendees_list[attendees_List.length - 1]) {
        nameString += "and <@" + element.name + "> have RSVPed!";
      }
    });
  }
  if (type === "REMINDER") {
    fallback =
      `Reminder! hangout: ${hangout.topic} is set to start on ${
        hangout.start_time
      }. Visit` + Meteor.absoluteUrl("hangout/" + hangout._id);
    pretext = `Reminder! ${hangout.type} hangout: *${
      hangout.topic
    }* scheduled by a CodeBuddies member is set to start in *less than two hours!* ${nameString}`;
  }
  if (type === "NEW") {
    fallback =
      "A new hangout has been scheduled. Visit" +
      Meteor.absoluteUrl("hangout/" + hangout._id);
    pretext = `A new *${
      hangout.type
    }* hangout has been scheduled by a fellow CodeBuddies member!`;
  }
  if (type === "UPDATE") {
    fallback = `Update: hangout ${hangout.topic} has been revised to start on ${
      hangout.start
    } and finish on ${hangout.end}. Visit ${Meteor.absoluteUrl(
      "hangout/" + hangout._id
    )}`;
    pretext = `Update: ${hangout.type} hangout: *${
      hangout.topic
    }* has been scheduled at a different time!`;
  }

  let date_start, now_value, now_formatted_time, difference, minutes;
  date_start = moment.utc(hangout.start);
  now_value = moment.utc(); //.format('MMMM Do YYYY, h:mm a z');
  hangout_formatted_time = moment
    .utc(hangout.start)
    .format("MMMM Do YYYY, h:mm a z");
  now_formatted_time = moment.utc().format("MMMM Do YYYY, h:mm a z");
  difference = moment.duration(date_start.diff(now_value));
  minutes = difference.asMinutes();
  if (minutes < 0) {
    // this is to protect from time being in the past (negative number)
    minutes = Math.abs(minutes) + minutes;
    // console.log("this was negative and changed it to: " + minutes);
  }
  if (minutes >= 60) {
    var hours_whole = difference.asHours();
    var hours = Math.floor(hours_whole);
    var rem = Math.floor(minutes - hours * 60);
    var days_whole = difference.asDays();
    var days = Math.floor(days_whole);
    var rem_hours = Math.floor(hours_whole - days * 24);

    if (hours == 1) {
      //Singular
      time_left = "Starts in " + hours + " hr & " + rem + " mins!";
    } else if (hours > 1 && hours < 24) {
      //Plural
      time_left = "Starts in " + hours + " hrs & " + rem + " mins!";
    } else if (hours >= 24 && days == 1) {
      time_left =
        "Starts in " + days + " day, " + rem_hours + " hrs & " + rem + " mins!";
    } else if (hours >= 24 && days > 1) {
      time_left =
        "Starts in " +
        days +
        " days, " +
        rem_hours +
        " hrs & " +
        rem +
        " mins!";
    }
  } else if (minutes >= 0 && minutes < 60) {
    var rem = Math.floor(minutes);

    if (minutes >= 0 && minutes < 1) {
      time_left = "Hangout starts now!";
    } else {
      time_left = "Starts in " + (rem + 1) + " mins!";
    }
  }

  let hangoutTitle, hangoutDescription;
  hangoutTitle = hangout.topic;
  hangoutDescription = hangout.description;

  if (hangoutTitle.length > 101) {
    hangoutTitle = `${hangoutTitle.substr(0, 101) + "..."}`;
  } else {
    hangoutTitle.substr(0, 101);
  }

  if (hangoutDescription.length > 201) {
    hangoutDescription = `${hangout.description.substr(0, 201) + "..."}`;
  } else {
    hangoutDescription = `_ ${hangoutDescription.substr(0, 201)} _`;
  }

  let data = {
    attachments: [
      {
        fallback: fallback,
        color: "#1e90ff",
        pretext: pretext,
        title: hangoutTitle,
        title_link: Meteor.absoluteUrl("hangout/" + hangout._id),
        mrkdwn_in: ["text", "pretext", "fields"],
        fields: [
          {
            title: "Description",
            value: hangoutDescription,
            short: true
          },
          {
            title: "Date",
            value: `${hangout_formatted_time + "\n (" + time_left + ")"}`,
            short: true
          }
        ]
      }
    ]
  }; //data

  if (minutes >= 0) {
    hangoutAlert(data);
    if (hangoutChannels != null && hangoutChannels.length > 0) {
      hangoutChannels
        .filter(
          channel =>
            channel !== null && typeof channel !== "undefined" && channel !== ""
        )
        .forEach(channel => hangoutChannelAlert(channel)(data));
    }
  }
}; //slackNotification();

studyGroupAlert = slack.extend({
  channel: Meteor.settings.slack_alert_channel,
  icon_emoji: ":notebook:",
  username: Meteor.settings.slack_studygroup_alert_username
});

studyGroupNotification = function(studyGroup, studyGroupId) {
  const username = studyGroup.members[0].name;
  const studyGroupUrl = Meteor.absoluteUrl(
    `study-group/${studyGroup.slug}/${studyGroupId}`
  );
  const pretext = `A new study group has been created by a CodeBuddies member!\nTitle: *${
    studyGroup.title
  }*\nTagline:  *${studyGroup.tagline}*!\nJoin here: ${studyGroupUrl} `;

  studyGroupAlert({
    text: pretext
  });
};

facebookAlert = slack.extend({
  channel: Meteor.settings.slack_facebook_alert_channel,
  username: Meteor.settings.slack_alert_username
});

studyGroupFacebookNotification = function(studyGroup, studyGroupId) {
  const username = studyGroup.members[0].name;
  const studyGroupUrl = Meteor.absoluteUrl(
    `study-group/${studyGroup.slug}/${studyGroupId}`
  );
  const pretext = `A CodeBuddies member has started a "${
    studyGroup.title
  }" study group with the tagline "${
    studyGroup.tagline
  }"!\n\nJoin here: ${studyGroupUrl} `;
  facebookAlert({ text: pretext });
};

hangoutFacebookNotification = function(hangout, type) {
  const hangoutUrl = Meteor.absoluteUrl(`hangout/${hangout._id}`);
  let pretext = "";
  if (type === "NEW") {
    pretext = `A CodeBuddies member has scheduled a ${
      hangout.type
    } hangout with the topic "${hangout.topic}" in the "${
      hangout.group.title
    }" study group!\n\nWHEN:\n ${time_left} \n\nRSVP:\n ${hangoutUrl}\n\nDESCRIPTION:\n ${
      hangout.description
    }`;
  }
  if (type === "UPDATE") {
    pretext = `A CodeBuddies member has *rescheduled* a ${
      hangout.type
    } hangout with the topic "${hangout.topic}" in the "${
      hangout.group.title
    }" study group!\n\nWHEN:\n ${time_left} \n\nRSVP:\n ${hangoutUrl}\n\nDESCRIPTION:\n ${
      hangout.description
    }`;
  }
  facebookAlert({ text: pretext });
};

/**
 * slack alert for new discussion
 * @function
 * @name discussionsSlackAlert
 * @param { Object } discussion - Data
 * @return null
 */
discussionsSlackAlert = function(discussion) {
  const channel = Meteor.isDevelopment
    ? Meteor.settings.slack_alert_channel
    : discussion.channel;
  discussionAlert = slack.extend({
    channel: channel,
    icon_emoji: ":discussion:",
    username: "Discussion Alerts"
  });

  const username = discussion.author.username;
  const discussionURL = Meteor.absoluteUrl(`discussion/${discussion._id}`);
  const pretext = `A CodeBuddies member has started a new discussion: *${
    discussion.topic
  }* \nChime in here: ${discussionURL} `;

  discussionAlert({
    text: pretext
  });
};

/**
 * slack alert for when someone joins the 24/7
 * co-working hangout
 * @function
 * @name coworkingSlackAlert
 * @param { String } username
 * @return null
 */
coworkingSlackAlert = function(username = "guest") {
  const channel = Meteor.isDevelopment
    ? Meteor.settings.slack_alert_channel
    : "#coworking";
  coworkingAlert = slack.extend({
    channel: channel,
    icon_emoji: ":coworking:",
    username: "Coworking 24/7"
  });
  const jitsiRoom =
    "https://meet.jit.si/cbcoworking#config.startWithVideoMuted=true";

  const pretext = `*${username}* _has joined the_ <${jitsiRoom}|24/7 silent coworking> room.`;

  coworkingAlert({
    text: pretext
  });
};
