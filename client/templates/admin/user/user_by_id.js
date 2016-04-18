Template.registerHelper('selected', function(key, value) {
  return key == value ? 'selected' : '';
});
Template.registerHelper("currentUser", function(argument){
  
});
Template.userById.helpers({
  getUser:function(){
    var userId = FlowRouter.getParam('userId');
    return Meteor.users.find({_id:userId});
  },
});

Template.userById.events({
  "change #authorization": function(event, template){
    var currentAuthorization = template.find('#authorization').value;
    var pastAuthorization =  this.roles[0];
    Meteor.call("updateRoles",this._id,this.user_info.name,currentAuthorization,pastAuthorization);


  },
});
