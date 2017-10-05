Template.privacyPolicy.onRendered(function() {
  $(function() {

    // Move to the top of the page on render
    var $window = $(window);
    if ($window.scrollTop() > 0) {
      $window.scrollTop(0);
    }
  });
});
