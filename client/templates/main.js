// import {_} from 'meteor/erasaur:meteor-lodash';

if (Meteor.isClient) {
  Meteor.startup(function () {
    if(!Meteor.settings.public.isModeDebug){
      console = console || {};
      console.log = function(){};
    }
  });
}
Tracker.autorun(function() {

  if (Session.get('hangoutSearchQuery'))
    Meteor.subscribe('hangoutSearchResult', Session.get('hangoutSearchQuery'));
});

Template.registerHelper('equals', function (a, b) {
      return a === b;
});

Template.registerHelper('cleanDateFormatCalendar', function(date) {
  return moment(date).calendar();
});

Template.registerHelper("isUserCommentAuthor", function(authorId){
  return  Meteor.userId() === authorId ? true : false ;
});

Template.registerHelper("totalVotes", function(upvote = 0, downvote = 0){
  return  upvote - downvote;
});

Template.registerHelper("getHangoutTypeSign", function(hangoutType){
  if (hangoutType == 'silent') {
    return 'fa-microphone-slash text-danger-color';
  } else if (hangoutType == 'teaching') {
    return 'fa-user text-warning-color';
  } else if (hangoutType == 'collaboration') {
    return 'fa-users text-success-color';
  }
});

Template.registerHelper("getHangoutStartDateTime", function(date){
  const tz = TimezonePicker.detectedZone();
  return moment(date).tz(tz).format('ddd MMMM Do YYYY, h:mm a z');
});

Template.registerHelper("getHangoutEndDateTime", function(date){
  const tz = TimezonePicker.detectedZone();
  return moment(date).tz(tz).format('MMMM Do h:mm a z')
});

Template.registerHelper('isHangoutUpcoming', function(startDate) {
  return startDate > new Date() ? true : false;
});

Template.registerHelper("isHangoutInProgress", function(startDate, endDate){
  return (startDate <= new Date() && endDate >= new Date()) ? true : false;
});

Template.registerHelper('isHangoutCompleted', function(endDate) {
  return endDate < new Date() ? true : false;
});

Template.registerHelper("isAttending", function(users){
  return users.indexOf(Meteor.userId()) != -1;
});

Template.registerHelper("upcomingTime", function(start){
  return start > new Date() ? TAPi18n.__("upcoming_time", { time: moment(start).fromNow() }) : "nan" ;
});

Template.registerHelper("isHangoutEndTimeTBA", function(start, end){
  const duration = (end - start) / (1000 * 60 * 60 * 24)
  return duration === 1 ?  true : false;
});
