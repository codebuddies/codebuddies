/**
* Create new progress log
* @function
* @name createNewProgressLog
* @param { data } Object
* @return {Boolean} true on success
*/
Meteor.methods({
  createNewProgressLog:function(data){
    check(data,{
      title: String,
      slug: String,
      description: String,
      description_in_quill_delta: Match.ObjectIncluding({
       ops: Match.Any
      }),
      study_group_id: String,
      study_group_title: String
    });

    if (!this.userId) {
      throw new Meteor.Error('ProgressLogs.methods.createNewProgressLog.not-logged-in', 'Must be logged in to create new Study Group.');
    }

    const user = Meteor.user();

    const progressLog = {
      title: data.title,
      slug: data.slug,
      description: data.description,
      description_in_quill_delta: data.description_in_quill_delta,
      created_at: new Date(),
      study_group: {
        id: data.study_group_id,
        title: data.study_group_title
      },
      author: {
        id: user._id,
        username: user.username
      },
      visibility: true
    }

    ProgressLogs.insert(progressLog);

    return true;

  }
});

/**
* progress log count for SG
* @function
* @name progressLogCountByStudyGroupId
* @param { String } _id study group id
* @return { Number } log count
*/

Meteor.methods({
  progressLogCountByStudyGroupId:function(studyGroupID){
    check(studyGroupID, String);

    return ProgressLogs.find({'study_group.id': studyGroupID}).count() || 0;

  }
});
