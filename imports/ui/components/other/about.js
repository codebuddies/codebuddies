import flags from "/imports/data/flags.json";
import c from "/imports/data/contributors.json";

Template.about.onCreated(function() {
  var title = "CodeBuddies | About";
  var metaInfo = {
    name: "description",
    content:
      "Our community spends a lot of time helping each other on Slack, but it's hard to schedule study times in advance in a chatroom, and it's also hard to know who else is online possibly working on the same thing at the same time. This website solves those issues."
  };
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.about.onRendered(function() {
  $(function() {
    // Move to the top of the page on render
    var $window = $(window);
    if ($window.scrollTop() > 0) {
      $window.scrollTop(0);
    }

    //$('a.user-popover').popover({ trigger: "hover", html: "true" });
    $("a.user-popover").each(function() {
      var $elem = $(this);
      $elem.popover({
        placement: "top",
        trigger: "hover",
        html: true,
        container: $elem,
        animation: false,
        title: "Name goes here",
        content: "This is the popover content. You should be able to mouse over HERE."
      });
    });

    // display fallback image if image url of contributor is broken
    $("img.img-circle").on("error", function() {
      $(this).prop("src", "/images/unknown.png");
    });
  });
});

Template.about.helpers({
  countries: function() {
    return flags.countries;
  },
  contributors: function() {
    return c.contributors;
  }
});
