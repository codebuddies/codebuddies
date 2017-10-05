Template.faq.onCreated(function(){
  var title = "CodeBuddies | Home";
  var metaInfo = {name: "description", content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);  DocHead.setTitle('CodeBuddies | FAQ');
});

Template.faq.onRendered(function() {
  $(function() {

    // Move to the top of the page on render
    var $window = $(window);
    if ($window.scrollTop() > 0) {
      $window.scrollTop(0);
    }
  });
});
