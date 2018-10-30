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
  createNewStudyGroup: function(data) {
    check(data, {
      title: String,
      tagline: String,
      slug: String,
      tags: Match.Maybe([String])
    });

    if (!this.userId) {
      throw new Meteor.Error(
        "StudyGroups.methods.createNewStudyGroup.not-logged-in",
        "Must be logged in to create new Study Group."
      );
    }

    // Check study group name is unique
    const regex = new RegExp(`^${data.title}$`, "i");
    const isTitleAlreadyUsed = StudyGroups.findOne({
      title: regex,
      visibility: true
    });
    if (isTitleAlreadyUsed) {
      throw new Meteor.Error(
        "StudyGroups.methods.createNewStudyGroup.title-already-used",
        "Study group name is already used"
      );
    }

    const user = Meteor.user();

    const studyGroup = {
      title: data.title,
      slug: data.slug,
      tagline: data.tagline,
      tags: data.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          id: user._id,
          name: user.username,
          avatar: user.profile.avatar.default,
          role: "owner",
          status: "",
          status_modifiedAt: null
        }
      ],
      visibility: true,
      exempt_from_default_permission: false
    };

    studyGroupId = StudyGroups.insert(studyGroup);
    console.log("studyGroupId", studyGroupId);

    //by default the creator of the study gets an owner privilege
    Roles.addUsersToRoles(user._id, "owner", studyGroupId);

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
      icon: "fa-birthday-cake",
      study_group: {
        id: studyGroupId,
        title: data.title,
        slug: data.slug
      },
      read: [user._id]
    };

    Activities.insert(activity);

    // send slack alert
    studyGroupNotification(studyGroup, studyGroupId);
    studyGroupFacebookNotification(studyGroup, studyGroupId);

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
  joinStudyGroup: function(data) {
    check(data, {
      studyGroupId: String,
      studyGroupTitle: String,
      studyGroupSlug: String
    });

    // default user privilege.
    const role = "member";

    if (!this.userId) {
      throw new Meteor.Error(
        "StudyGroups.methods.joinStudyGroup.not-logged-in",
        "Must be logged in to join any Study Group."
      );
    }

    const user = Meteor.user();

    const member = {
      id: user._id,
      name: user.username,
      avatar: user.profile.avatar.default,
      role: role,
      status: "",
      status_modifiedAt: null
    };

    StudyGroups.update(
      { _id: data.studyGroupId },
      {
        $push: {
          members: {
            $each: [member],
            $sort: { name: 1 }
          }
        },
        $set: {
          updatedAt: new Date()
        }
      }
    );

    //by default on join person gets a member privilege
    Roles.addUsersToRoles(user._id, role, data.studyGroupId);

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
      icon: "fa-user-plus",
      study_group: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      read: [user._id],
      email_notifications: {
        initial: false
      }
    };

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
  leaveStudyGroup: function(data) {
    check(data, {
      studyGroupId: String,
      studyGroupTitle: String,
      studyGroupSlug: String
    });

    const user = Meteor.user();

    const member = {
      id: user._id,
      name: user.username,
      avatar: user.profile.avatar.default
    };

    //check if the user is a member
    if (!user || !Roles.userIsInRole(user, ["admin", "member", "moderator"], data.studyGroupId)) {
      throw new Meteor.Error(
        "StudyGroups.methods.leaveStudyGroup.not-logged-in",
        "Sorry, you cannot leave this group."
      );
    }

    const memberId = user._id;

    StudyGroups.update({ _id: data.studyGroupId }, { $pull: { members: { id: memberId } } });

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
      icon: "fa-sign-out-alt",
      study_group: {
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      read: [user._id]
    };

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
  updateUserRoleForStudyGroup(data) {
    check(data, {
      user: Match.ObjectIncluding({
        id: String,
        username: String,
        avatar: String
      }),
      role: String,
      studyGroupId: String
    });

    //console.log(data);

    const expectedRoles = ["admin", "moderator", "member"];
    const actor = Meteor.user();

    //check if user is owner or admin
    if (!actor || !Roles.userIsInRole(actor, ["owner", "admin"], data.studyGroupId)) {
      throw new Meteor.Error(
        403,
        "Sorry, you are an admin in this group. If you want to leave, please ask another admin to make you a member."
      );
    }

    if (expectedRoles.indexOf(data.role) < 0) {
      throw new Meteor.Error(403, "Unexpected Role");
    }

    StudyGroups.update(
      { _id: data.studyGroupId, "members.id": data.user.id },
      {
        $set: { "members.$.role": data.role }
      }
    );

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

/**
 * update study group info
 * @function
 * @name updateStudyGroupInfo
 * @param {Object}
 * @return {Boolean} true on success
 */

Meteor.methods({
  updateStudyGroupInfo(data) {
    check(data, {
      id: String,
      introduction: String,
      description: String
    });

    const actor = Meteor.user();

    //check if user is owner or admin
    if (!actor || !Roles.userIsInRole(actor, ["owner", "admin"], data.id)) {
      throw new Meteor.Error(403, "Access denied");
    }

    StudyGroups.update(
      { _id: data.id },
      {
        $set: {
          introduction: data.introduction,
          description: data.description,
          updatedAt: new Date()
        }
      }
    );

    return true;
  }
});

/**
 * update study group title and tagline
 * @function
 * @name updateStudyGroupTitle
 * @param {Object}
 * @return {Boolean} true on success
 */

Meteor.methods({
  updateStudyGroupTitle(data) {
    check(data, {
      id: String,
      title: String,
      tagline: String,
      tags: Match.Maybe([String])
    });

    const actor = Meteor.user();

    //check if user is owner or admin
    if (!actor || !Roles.userIsInRole(actor, ["owner", "admin"], data.id)) {
      throw new Meteor.Error(403, "Access denied");
    }

    StudyGroups.update(
      { _id: data.id },
      {
        $set: {
          title: data.title,
          tagline: data.tagline,
          tags: data.tags,
          updatedAt: new Date()
        }
      }
    );

    return true;
  }
});

/**
 * Archive Studygroup
 * @function
 * @name archieveStudyGroup
 * @param {String} _id - studyGroupId
 * @return {Boolean} true on success
 */

Meteor.methods({
  archiveStudyGroup(studyGroupId) {
    check(studyGroupId, String);

    const actor = Meteor.user();

    //check if user is owner
    if (!actor || !Roles.userIsInRole(actor, ["owner"], studyGroupId)) {
      throw new Meteor.Error(403, "Access denied");
    }

    const members = StudyGroups.findOne({ _id: studyGroupId }).members;

    //remove studygroup
    StudyGroups.update({ _id: studyGroupId }, { $set: { visibility: false } });
    //remove members permission
    members.forEach(member => {
      Roles.setUserRoles(member.id, [], studyGroupId);
    });

    //remove hangouts
    Hangouts.update({ "group.id": studyGroupId }, { $set: { visibility: false } });

    return true;
  }
});

/**
 * update study group permission
 * for hangout creation
 * @function
 * @name updateHangoutCreationPermission
 * @param {Object}
 * @return {Boolean} true on success
 */
Meteor.methods({
  updateHangoutCreationPermission(data) {
    check(data, {
      id: String,
      permission: Boolean
    });

    const actor = Meteor.user();

    //check if user is owner or admin
    if (!actor || !Roles.userIsInRole(actor, ["owner"], data.id)) {
      throw new Meteor.Error(403, "Access denied");
    }

    StudyGroups.update({ _id: data.id }, { $set: { exempt_from_default_permission: data.permission } });

    return true;
  }
});

/**
 * update study group member status
 * @function
 * @name updateUserStatusForStudyGroup
 * @param {Object}
 * @return {Boolean} true on success
 */
Meteor.methods({
  updateUserStatusForStudyGroup: function(data) {
    check(data, {
      status: String,
      study_group_id: String
    });

    if (!this.userId) {
      throw new Meteor.Error(
        "Members.methods.editStatus.not-logged-in",
        "Must be logged in to edit the member status."
      );
    }

    const actor = Meteor.user();
    if (!actor || !Roles.userIsInRole(actor, ["owner", "admin", "moderator", "member"], data.study_group_id)) {
      throw new Meteor.Error(403, "Access denied");
    }

    StudyGroups.update(
      { _id: data.study_group_id, "members.id": actor._id },
      {
        $set: {
          "members.$.status": data.status,
          "members.$.status_modifiedAt": new Date()
        }
      }
    );

    return true;
  }
});

Meteor.methods({
  transferStudyGroupOwnership: function(data) {
    check(data, {
      studyGroupId: String,
      newOwnerId: String
    });

    if (!this.userId) {
      throw new Meteor.Error("Members.methods.editStatus.not-logged-in", "Must be logged in to transfer study group.");
    }

    const actor = Meteor.user();
    if (!actor || !Roles.userIsInRole(actor, ["owner"], data.studyGroupId)) {
      throw new Meteor.Error(403, "Access denied");
    }

    if (!Roles.userIsInRole(data.newOwnerId, ["admin", "moderator", "member"], data.studyGroupId)) {
      throw new Meteor.Error(403, "Access denied");
    }

    //Remove old owner and update role of new owner to 'owner'
    StudyGroups.update({ _id: data.studyGroupId, "members.id": actor._id }, { $set: { "members.$.role": "admin" } });
    StudyGroups.update(
      { _id: data.studyGroupId, "members.id": data.newOwnerId },
      { $set: { "members.$.role": "owner" } }
    );
    Roles.setUserRoles(actor._id, "admin", data.studyGroupId);
    Roles.setUserRoles(data.newOwnerId, "owner", data.studyGroupId);

    const studyGroup = StudyGroups.findOne({ _id: data.studyGroupId });

    const subject = Meteor.users.findOne({ _id: data.newOwnerId });

    //activity
    const activity = {
      actor: {
        id: actor._id,
        name: actor.username,
        avatar: actor.profile.avatar.default
      },
      type: "GROUP_TRANSFERRED",
      action: "transferred",
      subject: {
        id: subject._id,
        name: subject.username,
        avatar: subject.profile.avatar.default
      },
      created_at: new Date(),
      icon: "fa-plane",
      study_group: {
        id: studyGroup._id,
        title: studyGroup.title,
        slug: studyGroup.slug
      },
      read: [actor._id]
    };

    Activities.insert(activity);

    return true;
  }
});

Meteor.methods({
  saveHangoutChannel: function(data) {
    check(data, {
      studyGroupId: String,
      hangoutChannels: Match.Maybe([String])
    });

    if (!this.userId) {
      throw new Meteor.Error("Members.methods.editStatus.not-logged-in", "Must be logged in to save hangout channels.");
    }

    const actor = Meteor.user();
    if (!actor || !Roles.userIsInRole(actor, ["owner"], data.studyGroupId)) {
      throw new Meteor.Error(403, "Access denied");
    }

    //Update the list of Slack channels that will receive notifications when a hangout is scheduled in this group
    StudyGroups.update({ _id: data.studyGroupId }, { $set: { hangoutChannels: data.hangoutChannels } });
    return true;
  }
});

Meteor.methods({
  removeStudyGroups: function(userId) {
    check(userId, String);

    if (this.userId !== userId) {
      throw new Meteor.Error(
        "StudyGroup.methods.removeStudyGroups.not-logged-in",
        "Must be logged in to Remove Study Groups."
      );
    }

    return StudyGroups.update(
      {
        members: {
          $elemMatch: {
            id: userId,
            role: "owner"
          }
        }
      },
      { $set: { visibility: false } },
      { multi: true }
    );
  }
});
