Template.hangoutsCreated.onCreated(function () {

  // 1. Initialization

  var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(3);

  // ...
   instance.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    //console.log("Asking for "+limit+" hangouts...")

    // subscribe to the posts publication
    var subscription = instance.subscribe('hangoutsCreated', limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      //console.log("> Received "+limit+" hangouts. \n\n")
      instance.loaded.set(limit);
    } else {
      //console.log("> Subscription is not ready yet. \n\n");
    }
  });

   instance.hangoutsCreated = function() { 
    return Hangouts.find({}, {sort: {timestamp: -1}, limit: instance.loaded.get()});
  }

});

Template.hangoutsCreated.helpers({
    // the posts cursor
  hangouts: function () {
    return Template.instance().hangoutsCreated();
  },
  // are there more posts to show?
  hasMoreHangouts: function () {
    return Template.instance().hangoutsCreated().count() >= Template.instance().limit.get();
  }
});

Template.hangoutsCreated.events({
 'click #load-more-hangouts': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 3;
    instance.limit.set(limit);
  }
});
