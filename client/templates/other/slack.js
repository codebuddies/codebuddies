Template.slack.onCreated(function(){
  var title = "CodeBuddies | Slack";
  var metaInfo = {name: "description", content: ""};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.slack.onRendered(function() {
  $(function() {

    // Move to the top of the page on render
    var $window = $(window);
    if ($window.scrollTop() > 0) {
      $window.scrollTop(0);
    }
  });
});
