Meteor.methods({
  discussionAdd:function(data){
    check(data,{
      topic: String,
      description: String,
      groupId: String,
      groupTitle: String,
      groupSlug: String,

    });


  }
});
