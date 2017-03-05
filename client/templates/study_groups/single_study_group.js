Template.singleStudyGroup.onCreated(function() {
  let instance = this;
  instance.studyGroupId = FlowRouter.getParam('studyGroupId');
  instance.isAddResource = new ReactiveVar( false );
  this.autorun(() => {
      this.subscribe('studyGroupById', instance.studyGroupId);
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
  isAddResource:function(){
    return Template.instance().isAddResource.get();
  },
});

Template.singleStudyGroup.events({
  "click #addResource": function(event, template){
     template.isAddResource.set( true );
  },
  "click #cancleAddResource": function(event, template){
     template.isAddResource.set( false );
  },
  "submit .addResource": function(event, template) {
    event.preventDefault();
    if ($.trim(template.find("#resourceTitle").value) == '') {
      return Bert.alert( 'Resource Title', 'warning', 'growl-top-right' );
    }
    if ($.trim(template.find("#resourceURL").value) == '') {
      return Bert.alert( 'Please URL', 'warning', 'growl-top-right' );
    }

    let data = {
      studyGroupId: this._id,
      studyGroupTitle: this.title,
      studyGroupSlug: this.slug,
      resourceTitle: template.find("#resourceTitle").value,
      resourceURL : template.find("#resourceURL").value
    }

    Meteor.call("addResource", data, function(error, result){
      if(error){
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        Bert.alert( 'Resource had been added', 'success', 'growl-top-right' );
        return template.isAddResource.set( false );
      }
    });

  },
  'click .joinStudyGroup': function(event, template){
    event.preventDefault();

    let data = {
      studyGroupId: this._id
    }

    Meteor.call("joinStudyGroup", data, function(error, result){
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'Join', 'success', 'growl-top-right' );

      }
    });

  },
  'click .leaveStudyGroup': function(event, template){
    event.preventDefault();


    let data = {
      studyGroupId: this._id
    }

    Meteor.call("leaveStudyGroup", data, function(error, result){
      if(error){
        return Bert.alert( error.reason, 'danger', 'growl-top-right' );
      }
      if(result){
        return Bert.alert( 'Leave', 'success', 'growl-top-right' );

      }
    });

  },
});
