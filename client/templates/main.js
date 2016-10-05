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


String.prototype.truncate = function(){
    var re = this.match(/^.{0,50}[\S]*/);
    var l = re[0].length;
    var re = re[0].replace(/\s$/,'');
    if(l < this.length)
        re = re + "...";
    return re;
}
