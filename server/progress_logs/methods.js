import {tweetLog} from '../twitter/methods.js';

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
      throw new Meteor.Error('ProgressLogs.methods.createNewProgressLog.not-logged-in', 'Must be logged in to create new Progress Log.');
    }

    const user = Meteor.user();

    let progressLog = {
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

    const logId = ProgressLogs.insert(progressLog);
    progressLog._id = logId;
    tweetLog(progressLog);
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

    return ProgressLogs.find({'study_group.id': studyGroupID, 'visibility':{$ne:false}}).count() || 0;

  }
});

/**
* reomove progress log
* @function
* @name removeProgressLog
* @param { String } _id study group id
* @return { Boolean } true on success
*/

Meteor.methods({
  removeProgressLog:function(logId){
    check(logId, String);

    const actor = Meteor.user();
    const progressLog = ProgressLogs.findOne({_id:logId});

    if (!this.userId) {
      throw new Meteor.Error('ProgressLogs.methods.removeProgressLog.not-logged-in', 'Must be logged in to create new Progress Log.');
    }

    if (progressLog.author.id !== actor._id) {
      throw new Meteor.Error('ProgressLogs.methods.removeProgressLog.not-logged-in', 'You are trying do something fishy.');
    }

    return ProgressLogs.update({_id:logId}, {$set:{ 'visibility': false }});

  }
});

/**
* update progress log
* @function
* @name updateProgressLog
* @param { String } _id study group id
* @return { Boolean } true on success
*/

Meteor.methods({
  updateProgressLog:function(data){
    check(data, {
      id: String,
      title: String,
      slug: String,
      description: String,
      description_in_quill_delta: Match.ObjectIncluding({
       ops: Match.Any
      })
    });

    const actor = Meteor.user();
    const progressLog = ProgressLogs.findOne({_id:data.id});

    if (!this.userId) {
      throw new Meteor.Error('ProgressLogs.methods.updateProgressLog.not-logged-in', 'Must be logged in to create new Progress Log.');
    }

    if (progressLog.author.id !== actor._id) {
      throw new Meteor.Error('ProgressLogs.methods.removeProgressLog.not-logged-in', 'You are trying do something fishy.');
    }

    return ProgressLogs.update({_id:data.id}, {$set:{
      title: data.title,
      slug: data.slug,
      description: data.description,
      description_in_quill_delta: data.description_in_quill_delta
    }});

  }
});
