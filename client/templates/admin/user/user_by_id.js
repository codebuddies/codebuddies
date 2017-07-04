Template.registerHelper('selected', function(key, value) {
  return key == value ? 'selected' : '';
});

Template.registerHelper('isUpdateable', function(userId, role) {
  var loggedInUserId = Meteor.userId();

  return ((userId == loggedInUserId || (role === 'moderator' && (!Roles.userIsInRole( loggedInUserId, ['admin'], 'CB')))) ? true : false);
});

Template.userById.helpers({
  getUser:function(){
    var userId = FlowRouter.getParam('userId');

    if (Roles.userIsInRole(userId, ['admin'], 'CB')) {
      return ;
    } else {
      return Meteor.users.find({_id:userId});
    }

  },
  userRoles: function(){
    const roles = Meteor.users.findOne({_id: FlowRouter.getParam('userId') }).roles;
    const roleGroup = 'CB';
    return roles[roleGroup] ;
  },
});

Template.userById.events({
  "change #authorization": function(event, template){
    var currentAuthorization = template.find('#authorization').value;
    console.log(this);
    const roleGroup = 'CB';
    var pastAuthorization =  this.roles[roleGroup].pop();
    console.log(pastAuthorization, currentAuthorization);
    var userId = this._id;
    var username = this.username;
    Meteor.call("updateRoles",this._id,this.username,currentAuthorization,pastAuthorization, roleGroup, function(error, result) {
      if (result) {
        swal("Done!", "Updated "+ username +"'s access right ", "success")
      }else{
        swal("Oops something went wrong!", error + "\n Try again", "error");
      }

    });
  },
});
