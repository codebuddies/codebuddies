Template.statusList.onCreated(function() {
  var instance = this;
  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(10);
  instance.totalNumberOfLearnings = new ReactiveVar(0);

  instance.autorun(function() {
    // get the limit
    var limit = instance.limit.get();

    //console.log("Asking for "+limit+" learnings…")

    // subscribe to the posts publication
    var subscription = instance.subscribe("learnings", limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      //console.log("> Received "+limit+" learnings. \n\n")
      instance.loaded.set(limit);
    } else {
      //console.log("> Subscription is not ready yet. \n\n");
    }

    // get total number of learnings
    Meteor.call("getTotalNumberOfLearnings", function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        instance.totalNumberOfLearnings.set(result);
      }
    });
  });
  instance.learnings = function() {
    return Learnings.find({}, { limit: instance.loaded.get(), sort: { created_at: -1 } });
  };
});
Template.statusList.helpers({
  usersOnlineCount: function() {
    return Meteor.users.find({ "status.online": true }).count();
  },
  usersOnline: function() {
    return Meteor.users.find({ "status.online": true });
  },
  isWorking: function(type) {
    return type == "working";
  },
  learnedUsersCount: function() {
    return Template.instance().totalNumberOfLearnings.get();
  },
  learnings: function() {
    return Template.instance().learnings();
  },
  // are there more posts to show?
  hasMoreLearnings: function() {
    return (
      Template.instance()
        .learnings()
        .count() >= Template.instance().limit.get()
    );
  }
});

Template.statusList.events({
  "click #load-more-learnings": function(event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit);
  },
  "click .signIn": function(event) {
    var options = {
      requestPermissions: ["identity.basic", "identity.email"]
    };
    Meteor.loginWithSlack(options);
  },
  "click .signInGithub": function(event) {
    var options = {
      requestPermissions: ["read:user", "user:email"]
    };
    Meteor.loginWithGithub(options);
  }
});
