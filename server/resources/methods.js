Meteor.methods({
  addResource:function(data){
    check(data,{
      studyGroupId: String,
      studyGroupTitle: String,
      studyGroupSlug: String,
      resourceTitle: String,
      resourceURL: String
    });

    if (!this.userId) {
      throw new Meteor.Error("unauthorized", "Unauthorized");
    }

    const loggedInUser =  Meteor.user();
    if (!loggedInUser || !Roles.userIsInRole(loggedInUser,['owner','admin', 'moderator', 'member'], data.studyGroupId)) {
     throw new Meteor.Error('Resources.methods.addResource.accessDenied','Cannot add link; access denied');
    }
    const username = loggedInUser.username;
    const avatar = loggedInUser.profile.avatar.default;

    const resource = {
      title: data.resourceTitle,
      url: data.resourceURL,
      study_group:{
        id: data.studyGroupId,
        title: data.studyGroupTitle,
        slug: data.studyGroupSlug
      },
      author:{
        id: loggedInUser._id,
        name: username,
        avatar: avatar
      },
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date()
    }

    const id = Resources.insert(resource);
    if (id) {
      return true
    }
  },
  deleteResource:function(id){
    Resources.remove( { _id: id } );
    return true
  }
});
