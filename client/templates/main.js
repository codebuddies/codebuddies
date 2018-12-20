if (Meteor.isClient) {
  Meteor.startup(function() {
    $("head").append('<script src="https://meet.jit.si/external_api.js"></script>');

    if (!Meteor.settings.public.isModeDebug) {
      console = console || {};
      console.log = function() {};
    }

    const defaultLang = "en";
    const localStorageLang = localStorage.getItem("languageCode");
    const browserLang = (window.navigator.userLanguage || window.navigator.language || "").slice(0, 2);
    TAPi18n.setLanguage(localStorageLang || browserLang || defaultLang)
      .fail(console.log)
      .always(() => localStorage.setItem("languageCode", TAPi18n.getLanguage()));
  });
}

Template.registerHelper("equals", function(a, b) {
  return a === b;
});

Template.registerHelper("cleanDateFormatCalendar", function(date) {
  return moment(date).calendar();
});

Template.registerHelper("relativeTime", function(date) {
  return moment(date)
    .startOf("minute")
    .fromNow();
});

Template.registerHelper("isUserCommentAuthor", function(authorId) {
  return Meteor.userId() === authorId ? true : false;
});

Template.registerHelper("totalVotes", function(upvote = 0, downvote = 0) {
  return upvote - downvote;
});

Template.registerHelper("getHangoutTypeSign", function(hangoutType) {
  if (hangoutType == "silent") {
    return "fa-microphone-slash text-danger-color";
  } else if (hangoutType == "teaching") {
    return "fa-user text-warning-color";
  } else if (hangoutType == "collaboration") {
    return "fa-users text-success-color";
  }
});

Template.registerHelper("getHangoutGoogleCalendarDate", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("YYYYMMDD");
});

Template.registerHelper("getHangoutGoogleCalendarTime", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("HHmmss");
});

Template.registerHelper("getHangoutStartDateTime", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("dddd MMMM Do YYYY, h:mm a z");
});

Template.registerHelper("getHangoutStartDateDay", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("dddd MMMM Do YYYY");
});

Template.registerHelper("getHangoutStartTime", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("h:mm a z");
});

Template.registerHelper("getHangoutEndDateTime", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("MMMM Do h:mm a z");
});

Template.registerHelper("getHangoutEndTime", function(date) {
  const tz = TimezonePicker.detectedZone();
  return moment(date)
    .tz(tz)
    .format("h:mm a z");
});

Template.registerHelper("isHangoutUpcoming", function(startDate) {
  return startDate > new Date() ? true : false;
});

Template.registerHelper("isHangoutInProgress", function(startDate, endDate) {
  return startDate <= new Date() && endDate >= new Date() ? true : false;
});

Template.registerHelper("isHangoutCompleted", function(endDate) {
  return endDate < new Date() ? true : false;
});

Template.registerHelper("isAttending", function(users) {
  return users.indexOf(Meteor.userId()) != -1;
});

Template.registerHelper("upcomingTime", function(start) {
  return start > new Date()
    ? TAPi18n.__("upcoming_time", { time: moment(start).fromNow() })
    : "The hangout has started!";
});

Template.registerHelper("isHangoutEndTimeTBA", function(start, end) {
  const duration = (end - start) / (1000 * 60 * 60 * 24);
  return duration === 1 ? true : false;
});

Template.registerHelper("isOwnerOfTheGroup", function(userId, groupId) {
  const loggedInUserId = Meteor.userId();

  return loggedInUserId !== userId && Roles.userIsInRole(loggedInUserId, ["owner"], groupId) ? true : false;
});

Template.registerHelper("canUpdateUserRoleForGroup", function(subjectId, groupId, subjectRole) {
  const loggedInUserId = Meteor.userId();

  return loggedInUserId !== subjectId &&
    (subjectRole !== "owner" && subjectRole !== "admin") &&
    Roles.userIsInRole(loggedInUserId, ["owner", "admin"], groupId)
    ? true
    : false;
});

Template.registerHelper("isOrganizers", function(role) {
  return ["owner", "admin", "moderator"].indexOf(role) < 0 ? false : true;
});

Template.registerHelper("slotDayString", function(day) {
  switch (day) {
    case 00:
      return "MON";
      break;
    case 01:
      return "TUE";
      break;
    case 02:
      return "WED";
      break;
    case 03:
      return "THU";
      break;
    case 04:
      return "FRI";
      break;
    case 05:
      return "SAT";
      break;
    case 06:
      return "SUN";
      break;
    default:
      return "NaN";
  }
});

Template.registerHelper("isAuthor", function(userId) {
  return Meteor.userId() === userId;
});

Template.registerHelper("inList", function(list, item) {
  if (list) {
    return list.indexOf(item) != -1;
  }
  return false;
});

Template.registerHelper("isInCollection", function(collection) {
  const actor = _.find(collection, function(item) {
    return item.id === Meteor.userId();
  });
  return actor ? true : false;
});

Template.registerHelper("truncateIt", function(text, length) {
  return text.truncate(length);
});

Template.registerHelper("instance", function() {
  return Template.instance();
});

Template.registerHelper("relativeTimeInMinute", function(date) {
  return moment(date)
    .startOf("minute")
    .fromNow();
});

Template.registerHelper("exceptMe", function(id) {
  // return _.reject(items, { 'id': Meteor.userId() });
  return id != Meteor.userId() ? true : false;
});
