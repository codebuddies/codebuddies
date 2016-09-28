Template.statusList.onCreated(function () {
   var instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(5);

  instance.autorun(function () {

    // get the limit
    var limit = instance.limit.get();

    //console.log("Asking for "+limit+" learnings…")

    // subscribe to the posts publication
    var subscription = instance.subscribe('learnings', limit);

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      //console.log("> Received "+limit+" learnings. \n\n")
      instance.loaded.set(limit);
    } else {
      //console.log("> Subscription is not ready yet. \n\n");
    }
  });
  instance.learnings = function() {
    return Learnings.find({}, {limit: instance.loaded.get(), sort: {created_at: -1}});
  }

});
Template.statusList.helpers({
  usersOnlineCount:function(){
    return Meteor.users.find({ "status.online": true }).count();
  },
  usersOnline:function(){
    return Meteor.users.find({ "status.online": true });
  },
  isWorking: function(type) {
    return type == 'working';
  },
  learnedUsersCount: function() {
    return Learnings.find({}).count();
  },
  // learnings: function() {
  //   return Learnings.find({}, { sort: { timestamp: -1 }});
  // },
  learnings: function () {
    return Template.instance().learnings();
  },
  // are there more posts to show?
  hasMoreLearnings: function () {
    return Template.instance().learnings().count() >= Template.instance().limit.get();
  }
});

Template.statusList.events({
'click #load-more-learnings': function (event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many posts are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit);
  }

});
