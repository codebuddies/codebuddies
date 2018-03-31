Template.header.onRendered(function(){
  this.subscribe('attendees', 10);
})
Template.header.helpers({
  user: function() {
    return Meteor.user();
  },
  notificationCount:function(){
    return ReactiveMethod.call('notificationCount');
  },
  userNotificationCount:function(){
    return RSVPnotifications.find({createorId:Meteor.userId(),'seen':false}).count();
  }
});

Template.header.events({
  'click .signInSlack': function(event) {
    var options = {
      requestPermissions: ['identify', 'users:read']
      // requestPermissions: ['identify']
    };
    Meteor.loginWithSlack(options, function() {
        FlowRouter.go("hangouts");
    });

  },
  'click #signOut': function(event) {
    Meteor.logout(function(err) {
      FlowRouter.go("home");
    });
  },
  'click #newHangout': function(event) {
    Modal.show('createHangoutModal');
  },
  'click #newStudyGroup': function(event) {
    Modal.show('newStudyGroupModal');
  },
  "click #newDiscussion" (event, template){
     const data = {
       _id: "CB",
       title: "CB",
       slug: "CB"
     }

     Modal.show("addDiscussionModal", data);
  },
  'click .signInGithub': function(event) {
    var options = {
      requestPermissions: ['read:user', 'user:email']
    };
    Meteor.loginWithGithub(options, function(err) {
      if (!err) {
        FlowRouter.go("hangouts");
      }
    });

  },
});
