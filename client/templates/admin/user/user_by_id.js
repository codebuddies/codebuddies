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
});

Template.userById.events({
  "change #authorization": function(event, template){
    var currentAuthorization = template.find('#authorization').value;
    var pastAuthorization =  this.roles[0];
    var userId = this._id;
    var username = this.username;
    Meteor.call("updateRoles",this._id,this.username,currentAuthorization,pastAuthorization, function(error, result) {
      if (result) {
        swal("Done!", "Updated "+ username +"'s access right ", "success")
      }else{
        swal("Oops something went wrong!", error + "\n Try again", "error");
      }

    });
  },
});
