/**
* Create new study group
* @function
* @name createNewStudyGroup
* @param {String} title - Name of the study group
* @param {String} tagline - Tagline
* @param {String} slug - Slug
* @return {Boolean} true on success
*/
Meteor.methods({
  createNewStudyGroup:function(data){
    check(data,{
       title: String,
       tagline: String,
       slug: String
     });

     if (!this.userId) {
       throw new Meteor.Error('StudyGroups.methods.createNewStudyGroup.not-logged-in', 'Must be logged in to create new Study Group.');
     }

     const user = Meteor.user();

     const studyGroup = {
       title: data.title,
       slug: data.slug,
       tagline: data.tagline,
       createdAt: new Date(),
       members: [
         {
           id: user._id,
           name: user.username,
           avatar: user.profile.avatar.default
         }
       ]
     }

    studyGroupId = StudyGroups.insert(studyGroup);
    console.log("studyGroupId", studyGroupId);

    //by default the creator of the study gets an owner privilege
    Roles.addUsersToRoles(user._id, 'owner', studyGroupId);

    return true;

  }
});


/**
* Join study group
* @function
* @name joinStudyGroup
* @param {String} _id - studyGroupId
* @return {Boolean} true on success
*/

Meteor.methods({
  'joinStudyGroup': function(data){
    check(data,{
      studyGroupId: String
    });

    if (!this.userId) {
      throw new Meteor.Error('StudyGroups.methods.joinStudyGroup.not-logged-in', 'Must be logged in to join any Study Group.');
    }

    const user = Meteor.user();

    const member = {
      id: user._id,
      name: user.username,
      avatar: user.profile.avatar.default
    }

    //TODO:make use of it for activities
    // const activity = {
    //
    // }



    StudyGroups.update({_id:data.studyGroupId}, {$addToSet:{members:member}});

    //TODO:make use of it for activities
    // const activityId = Activities.insert(activity);

    //by default on join person gets a member privilege
    Roles.addUsersToRoles(user._id, 'member', data.studyGroupId);

    return true;

  }
});

/**
* Leave study group
* @function
* @name leaveStudyGroup
* @param {String} _id - studyGroupId
* @return {Boolean} true on success
*/

Meteor.methods({
  'leaveStudyGroup': function(data){
    check(data,{
      studyGroupId: String
    });


    const user = Meteor.user();

    //
    if (!user || !Roles.userIsInRole(user, ['member', 'moderator'], data.studyGroupId)) {
        throw new Meteor.Error('StudyGroups.methods.leaveStudyGroup.not-logged-in', 'Access denied');
    }

    const memberId = user._id;

    //TODO:make use of it for activities
    // const activity = {
    //
    // }

    StudyGroups.update({_id:data.studyGroupId}, { $pull: { members: { id : memberId } } });

    //TODO:make use of it for activities
    // const activityId = Activities.insert(activity);

    //remove privilege for user
    Roles.setUserRoles(memberId, [], data.studyGroupId);


    return true;
  }
});
