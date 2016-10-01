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
