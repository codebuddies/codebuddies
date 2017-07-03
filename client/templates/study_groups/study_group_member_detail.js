Template.studyGroupMemberDetail.onRendered(function(){
  const user = this.data;
  const studyGroupId = FlowRouter.getParam('studyGroupId');
  const instance = this;
  this.autorun(function(){
     instance.subscribe("studyGroupMemberDetail", studyGroupId, user.id);
  });

});


Template.studyGroupMemberDetail.helpers({
  user: function(){

    return Meteor.users.findOne({_id: Template.instance().data.id });

  },
  groupId: function(){
    return FlowRouter.getParam('studyGroupId');
  },
  userRoles: function(){
    const roles = Meteor.users.findOne({_id: Template.instance().data.id }).roles;
    const studyGroupId = FlowRouter.getParam('studyGroupId');
    return roles[studyGroupId] ;
  },
});

Template.studyGroupMemberDetail.events({
  "change #authorization": function(event, template){
     console.log(this);
     console.log(template.find("#authorization").value);

     //todo - update user role
  }
});
