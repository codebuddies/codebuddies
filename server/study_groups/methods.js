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

    //activity
    const activity = {
      actor: {
        id: user._id,
        name: user.username,
        avatar: user.profile.avatar.default
      },
      type: "GROUP_CREATION",
      action: "created",
      subject: {
        id: studyGroupId,
        title: data.title,
        slug: data.slug
      },
      created_at: new Date(),
      icon: 'fa-birthday-cake',
      study_group: {
        id: studyGroupId,
        title: data.title,
        slug: data.slug
      },
      read: [user._id]
    }

    Activities.insert(activity);


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
      studyGroupId: String,
      studyGroupTitle: String,
      studyGroupSlug: String
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

    StudyGroups.update({_id:data.studyGroupId}, {$addToSet:{members:member}});

    //by default on join person gets a member privilege
    Roles.addUsersToRoles(user._id, 'member', data.studyGroupId);

    //activity
    const activity = {
      actor: member,
      type: "USER_JOIN",
      action: "joined",
      subject: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      created_at: new Date(),
      icon: 'fa-user-plus',
      study_group: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      read: [user._id]
    }

    Activities.insert(activity);

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
      studyGroupId: String,
      studyGroupTitle: String,
      studyGroupSlug: String
    });


    const user = Meteor.user();

    const member = {
      id: user._id,
      name: user.username,
      avatar: user.profile.avatar.default
    }

    //check if the user is a member
    if (!user || !Roles.userIsInRole(user, ['member', 'moderator'], data.studyGroupId)) {
        throw new Meteor.Error('StudyGroups.methods.leaveStudyGroup.not-logged-in', 'Access denied');
    }

    const memberId = user._id;


    StudyGroups.update({_id:data.studyGroupId}, { $pull: { members: { id : memberId } } });


    //remove privilege for user
    Roles.setUserRoles(memberId, [], data.studyGroupId);


    //activity
    const activity = {
      actor: member,
      type: "USER_LEAVE",
      action: "left",
      subject: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      created_at: new Date(),
      icon: 'fa-sign-out',
      study_group: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      read: [user._id]
    }

    Activities.insert(activity);


    return true;
  }
});





/**
* update user role for study_group
* @function
* @name updateUserRoleForStudyGroup
* @param { data } Object
* @return {Boolean} true on success
*/

Meteor.methods({
  updateUserRoleForStudyGroup(data){


    check(data,{
      user: Match.ObjectIncluding({
        id: String,
        username: String,
        avatar: String
      }),
      role: String,
      studyGroupId: String
    })

    //console.log(data);

    const expectedRoles= ['admin','moderator', 'member'];
    const actor = Meteor.user()

    //check if user is owner or admin
    if (!actor || !Roles.userIsInRole(actor, ['owner','admin'], data.studyGroupId )) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (expectedRoles.indexOf(data.role) < 0 ) {
      throw new Meteor.Error(403, "Unexpected Role");
    }

    //role update
    Roles.setUserRoles(data.user.id, data.role, data.studyGroupId);

    // Todo
    // create activity
    // const activity = {
    //
    // }

    return true;

  }
});
