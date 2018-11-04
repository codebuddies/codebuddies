Template.profileLearnings.onCreated(function() {
  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);

  // ...
  instance.autorun(function() {
    // get the limit
    var limit = instance.limit.get();

    console.log("Asking for " + limit + " learnings...");
    var userId = FlowRouter.getParam("userId");
    console.log(userId);
    // subscribe to the learningsByUserId publication
    var subscription = instance.subscribe("learningsByUserId", limit, userId);
    console.log(subscription);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received " + limit + " learnings. \n\n");
      instance.loaded.set(limit);
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  instance.learningsForUser = function() {
    return Learnings.find({}, { limit: instance.loaded.get(), sort: { created_at: -1 } });
  };
});

Template.profileLearnings.helpers({
  // the posts cursor
  learnings: function() {
    return Template.instance().learningsForUser();
  },
  // are there more posts to show?
  hasMoreLearnings: function() {
    return (
      Template.instance()
        .learningsForUser()
        .count() >= Template.instance().limit.get()
    );
  }
});

Template.profileLearnings.events({
  "click #load-more-learnings": function(event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many learnings are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit);
  }
});
