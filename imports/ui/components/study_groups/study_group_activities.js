Template.studyGroupActivities.onCreated(function() {
  let instance = this;

  // initialize the reactive variables
  instance.loaded = new ReactiveVar(0);
  instance.limit = new ReactiveVar(12);

  this.autorun(() => {
    //Pagination
    let limit = this.limit.get();
    let studyGroupId = FlowRouter.getParam("studyGroupId");
    let subscription = instance.subscribe("allStudyGroupActivities", limit, studyGroupId);
    if (subscription.ready()) {
      instance.loaded.set(limit);
    }
  });

  instance.activitiesForStudyGroup = function() {
    return Activities.find({}, { limit: instance.loaded.get(), sort: { created_at: -1 } });
  };
});

Template.studyGroupActivities.helpers({
  activities: function() {
    //return Activities.find({'study_group.id': FlowRouter.getParam('studyGroupId') });
    return Template.instance().activitiesForStudyGroup();
  },
  hasMoreActivities: function() {
    return (
      Template.instance()
        .activitiesForStudyGroup()
        .count() >= Template.instance().limit.get()
    );
  }
});

Template.studyGroupActivities.events({
  "click #load-more-activities": function(event, instance) {
    event.preventDefault();

    // get current value for limit, i.e. how many activities are currently displayed
    var limit = instance.limit.get();

    // increase limit by 5 and update it
    limit += 5;
    instance.limit.set(limit);
  }
});
