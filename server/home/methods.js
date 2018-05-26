Meteor.methods({
  getOverallStats: () => {
    return {
      studyGroupCount: StudyGroups.find({}).count(),
      discussionCount: Discussions.find({}).count(),
      learningsCount: Learnings.find({}).count(),
      hangoutsCount: Hangouts.find({ visibility: { $ne: false } }).count()
    };
  }
});
