FlowRouter.notFound = {
  action() {
    BlazeLayout.render("layout", { top: "header", main: "pageNotFound" });
  }
};

FlowRouter.route("/", {
  name: "home",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "home",
      footer: "footer"
    });
  }
});

FlowRouter.route("/hangouts", {
  name: "hangouts",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "homeLoggedIn",
      footer: "footer"
    });
  }
});

FlowRouter.route("/hangout/:hangoutId", {
  name: "hangout",
  action: function(params, queryParams) {
    Meteor.call("incHangoutViewCount", params.hangoutId);
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "hangout",
      footer: "footer"
    });
  }
});

// @todo : make use of json for contributors
FlowRouter.route("/about", {
  name: "about",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "about",
      footer: "footer"
    });
  },
  triggersEnter: [
    function() {
      $("body").addClass("body-about");
    }
  ],
  triggersExit: [
    function() {
      $("body").removeClass("body-about");
    }
  ]
});

FlowRouter.route("/faq", {
  name: "faq",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "faq",
      footer: "footer"
    });
  }
});

FlowRouter.route("/coworking", {
  name: "coworking",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "coworking",
      footer: "footer"
    });
  },
  subscriptions: function(params, queryParams) {
    this.register("status", Meteor.subscribe("userStatus"));
  }
});

FlowRouter.route("/silent", {
  name: "coworking",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "coworking",
      footer: "footer"
    });
  },
  subscriptions: function(params, queryParams) {
    this.register("status", Meteor.subscribe("userStatus"));
  }
});

FlowRouter.route("/hangout-faq", {
  name: "hangout-faq",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hangoutFAQModal",
      footer: "footer"
    });
  }
});

// @todo : wip display learnings
FlowRouter.route("/learnings", {
  name: "learnings",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "learnings",
      footer: "footer"
    });
  }
});

FlowRouter.route("/privacy", {
  name: "privacyPolicy",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "privacyPolicy",
      footer: "footer"
    });
  }
});

FlowRouter.route("/terms-of-service", {
  name: "termsOfService",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "termsOfService",
      footer: "footer"
    });
  }
});

FlowRouter.route("/profile/:name/:userId", {
  name: "profile",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "profile",
      footer: "footer"
    });
  }
});

FlowRouter.route("/profile/:name/:userId/account-settings", {
  name: "account",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "userAccountSettings",
      footer: "footer"
    });
  }
});

FlowRouter.route("/notifications", {
  name: "user notification",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "rsvp",
      footer: "footer"
    });
  }
});

FlowRouter.route("/my-study-groups", {
  name: "my study groups",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "myStudyGroups",
      footer: "footer"
    });
  }
});

FlowRouter.route("/study-groups", {
  name: "all study groups",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "allStudyGroups",
      footer: "footer"
    });
  }
});

FlowRouter.route("/study-groups/owners-guide", {
  name: "study group owners guide",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "studyGroupOwnersGuide",
      footer: "footer"
    });
  }
});

FlowRouter.route("/welcome", {
  name: "welcome",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "welcome",
      footer: "footer"
    });
  },
  triggersEnter: [
    function() {
      $(window).scrollTop(0);
    }
  ]
});

FlowRouter.route("/study-group/:studyGroupSlug/:studyGroupId", {
  name: "study group",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "singleStudyGroup",
      footer: "footer"
    });
  },
  subscriptions: function(params, queryParams) {
    this.register("status", Meteor.subscribe("userStatus"));
  }
});

FlowRouter.route("/discussion/:discussionId", {
  name: "discussion",
  action: function(params, queryParams) {
    Meteor.call("discussions.incViewCount", params.discussionId);
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "discussion",
      footer: "footer"
    });
  }
});

FlowRouter.route("/discussions", {
  name: "discussions",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "allDiscussions",
      footer: "footer"
    });
  }
});

FlowRouter.route("/unsubscribe/:unsubscribeLinkId", {
  name: "unsubscribe me",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "unsubscribeFromMailingList",
      footer: "footer"
    });
  }
});

FlowRouter.route("/sponsor", {
  name: "Sponsor us!",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "sponsorUs",
      footer: "footer"
    });
  }
});

FlowRouter.route("/privacy", {
  name: "privacy",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "privacyPolicy",
      footer: "footer"
    });
  }
});

FlowRouter.route("/goodbye", {
  name: "goodbye",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", { top: "header", main: "goodbye" });
  }
});

FlowRouter.route("/slack", {
  name: "slack",
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "slack",
      footer: "footer"
    });
  }
});

FlowRouter.route("/inbox", {
  name: "inbox",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "inbox"
      // footer: "footer"
    });
  }
});

FlowRouter.route("/conversation/:conversationId", {
  name: "conversation",
  triggersEnter: [
    function(context, redirect) {
      if (!Meteor.userId()) {
        redirect("/");
      }
    }
  ],
  action: function(params, queryParams) {
    BlazeLayout.render("layout", {
      top: "header",
      main: "hasBlocked",
      targetTemplate: "conversation"
      // footer: "footer"
    });
  }
});

var sys = FlowRouter.group({
  prefix: "/admin"
});

sys.route("/", {
  name: "admin",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "sysHeader",
      main: "hasPermission",
      targetTemplate: "adminLanding"
    });
  }
});

sys.route("/dashboard", {
  name: "stats",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "dashboard"
    });
  }
});

sys.route("/dashboard/:sortUserAs", {
  name: "dashboard",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "sortUserAs"
    });
  }
});

sys.route("/manage-users", {
  name: "manage user",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "manageUser"
    });
  }
});

sys.route("/users/:role", {
  name: "user by role",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "usersByRole"
    });
  }
});

sys.route("/user/:userId", {
  name: "user by id",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "userById"
    });
  }
});

sys.route("/notifications", {
  name: "notifications",
  action: function() {
    BlazeLayout.render("sysLayout", {
      top: "header",
      main: "hasPermission",
      targetTemplate: "allNotification"
    });
  }
});
