Template.hangoutsJoined.onCreated(function () {

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
    var subscription = instance.subscribe('hangoutsJoined', limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      //console.log("> Received "+limit+" hangouts. \n\n")
      instance.loaded.set(limit);
    } else {
      //console.log("> Subscription is not ready yet. \n\n");
    }
  });

   instance.hangoutsJoined = function() { 
    return Hangouts.find({}, {sort: {timestamp: -1}, limit: instance.loaded.get()});
  }

});

Template.hangoutsJoined.helpers({
    // the posts cursor
  hangouts: function () {
    return Template.instance().hangoutsJoined();
  },
  // are there more posts to show?
  hasMoreHangouts: function () {
    return Template.instance().hangoutsJoined().count() >= Template.instance().limit.get();
  }
});

Template.hangoutsJoined.events({
 'click #load-more-hangouts': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 3;
    instance.limit.set(limit);
  }
});
