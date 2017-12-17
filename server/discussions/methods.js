/**
* Create new Discussion
* @function
* @name discussions.insert
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.insert':function(data){
    check(data,{
      topic: String,
      description: String,
      groupId: String,
      groupTitle: String,
      groupSlug: String,
    });


    const actor = Meteor.user();

    if (!actor || !Roles.userIsInRole(actor, ['owner','admin','moderator','member'], data.groupId)) {
      throw new Meteor.Error(403, "Access denied");
    }else {

    }

    // auth


    // data
    const author = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default,
    }
    const study_group = {
      id: data.groupId,
      title: data.groupTitle,
      slug: data.groupSlug
    }
    let discussion = {
      topic: data.topic,
      description: data.description,
      created_at: new Date(),
      modified_at: null,
      up_votes: [],
      down_votes: [],
      views: 0,
      version: 0,
      response_count: 0,
      visibility: true,
      locked: false,
      subscribers: [author],
      participants: [author],
      author: author,
      study_group: study_group,
    }

    //insert
    discussion._id = Discussions.insert(discussion);

    // @todo: notification


    return true;

  }
});

/**
* Update a Discussion
* @function
* @name discussions.update
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.update':function(data){
    check(data,{
      id: String,
      topic: String,
      description: String,
    });

    const actor = Meteor.user();

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const discussion = Discussions.findOne({"_id": data.id, "author.id": actor._id });

    if (!discussion) {
      throw new Meteor.Error(403, "Access denied");
    }


    Discussions.update({_id:data.id}, {
      $set:{
        topic: data.topic,
        description: data.description,
        modified_at: new Date()
      },
      $inc:{version: 1 }
    });

    return true

  }
});

/**
* Upvote a Discussion
* @function
* @name discussions.upvote
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.upvote':function(data){
    check(data, {
      id: String
    });

    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const voter = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default,
    }

    Discussions.update({_id:data.id}, {
      $addToSet: {
        up_vots: voter,
      },
      $pull: {
        down_vots: { id : voter.id }
      }
    });

    return true
  }
});

/**
* Downvote a Discussion
* @function
* @name discussions.downvote
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.downvote':function(data){
    check(data, {
      id: String
    });
    if (!actor) {
      throw new Meteor.Error(403, "Access denied");
    }

    const voter = {
      id: actor._id,
      username: actor.username,
      avatar: actor.profile.avatar.default,
    }

    Discussions.update({_id:data.id}, {
      $addToSet: {
        down_vots: voter,
      },
      $pull: {
        up_vots: { id : voter.id }
      }
    });

    return true

  }
});

/**
* Remove a Discussion
* @function
* @name discussions.remove
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.remove':function(data){
    check(data, {
      id: String
    });

    Discussions.update({_id:data.id}, {$set: {visibility: false}});

    return true
  }
});

/**
* increment view count
* @function
* @name discussions.incViewCount
* @param { Object } data - Data
* @return {Boolean} true on success
*/
Meteor.methods({
  'discussions.incViewCount':function(data){
    check(data, {
      id: String
    });

    Discussions.update({_id:data.id}, {$inc:{views:1}});

    return true;
  }
});
