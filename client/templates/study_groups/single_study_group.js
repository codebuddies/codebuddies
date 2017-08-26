Template.singleStudyGroup.onCreated(function() {
  let instance = this;
  instance.studyGroupId = FlowRouter.getParam('studyGroupId');
  instance.autorun(() => {
      instance.subscribe('studyGroupById', instance.studyGroupId);
  });

});

Template.singleStudyGroup.onRendered(function(){
  const title = "CodeBuddies | Study Groups";
  const metaInfo = {
    name: "description",
    content: "CodeBuddies is a community of independent code learners who enjoy sharing knowledge and helping each other learn faster. We come from all over the world; there are members living in the United States, Japan, Sweden, the United Kingdom, Russia, Australia, Canada, India, and more. Everyone is welcome, independent of previous knowledge."
  };

  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);

});

Template.singleStudyGroup.helpers({
  studyGroup: function(){
    return StudyGroups.findOne({_id:FlowRouter.getParam('studyGroupId')});
  },
  usersOnlineCount:function(){
    return Meteor.users.find({ "status.online": true }).count();
  },
});

Template.singleStudyGroup.events({
  "click #addResource": function(event, template){
     template.isAddResource.set( true );
  },
  "click #cancelAddResource": function(event, template){
     template.isAddResource.set( false );
  },
  'click .joinStudyGroup': function(event, template){
    event.preventDefault();

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    }

    Meteor.call("joinStudyGroup", data, function(error, result){
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'You have joined the study group!', 'success', 'growl-top-right' );

      }
    });

  },
  'click .leaveStudyGroup': function(event, template){
    event.preventDefault();

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug
    }

    Meteor.call("leaveStudyGroup", data, function(error, result){
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'You have left the study group!', 'success', 'growl-top-right' );

      }
    });

  },
  'click .memberDetail': function(event, template){
    event.preventDefault();
    return Modal.show('studyGroupMemberDetail', this);
  },
});
