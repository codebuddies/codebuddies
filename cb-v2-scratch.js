Learnings = new Mongo.Collection("learnings");

if (Meteor.isClient) {

  Meteor.subscribe('userStatus');

  Meteor.subscribe('learnings');

  Meteor.startup(function() {
   $(function () {
      $('[data-toggle="tooltip"]').tooltip();


        });
  });

  Template.activeUsers.helpers({
    usersOnline:function(){
      return Meteor.users.find({ "status.online": true })
    },
    usersOnlineCount:function(){
      //event a count of users online too.
    return Meteor.users.find({ "status.online": true }).count();
    }
  });

  Template.activeUsers.events({
    'focusout textarea#current_status': function(event) {
      var currentStatus = $(event.target).val();
      console.log(currentStatus);

      // Call the server method to update the current status
      Meteor.call('setUserStatus', currentStatus);
    },
    'click input[name="hangout_status"]': function(event) {
      var hangoutStatus = event.target.value;
      console.log(hangoutStatus);

      Meteor.call('setHangoutStatus', hangoutStatus);
    }
  });

  Template.activeUsers.labelClass = function() {
    if (this.status.idle)
      return "label-warning"
    else if (this.status.online)
      return "label-success"
    else
      return "label-default"
  };

  //configure the accounts UI to use usernames instead of email addresses:
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  //Learnings
  Template.learnings.helpers({
    learnings: function () {
      return Learnings.find({}, {sort: {createdAt: -1}});
    },
    date: function(){
      return moment(this.createdAt).format("MMMM DD");
    }
  });
  Template.learnings.events({
    "submit .submit-learning": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Meteor.call("addLearning", text);
 
      // Clear form
      event.target.text.value = "";
    }
  });
  Template.learning.events({
     "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteLearning", this._id);
    }
  });
}





if (Meteor.isServer) {
  Accounts.onCreateUser(function(user) {
    user.statusMessage = "";
    user.statusHangout = "";
    return user;
  });

  Meteor.methods({
    setUserStatus: function(currentStatus) {
      // Check the user is currently logged in
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      // Check the parameter is a string
      check(currentStatus, String);

      // Update the current users status
      Meteor.users.update({_id: Meteor.userId()}, {$set: {statusMessage: currentStatus}});
    },
    setHangoutStatus: function(hangoutStatus) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }

      Meteor.users.update({_id: Meteor.userId()}, {$set: {statusHangout: hangoutStatus}})
    },
    addLearning: function(text) {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Learnings.insert({
        text: text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username || Meteor.user().profile.name
      });
    },
    deleteLearning: function (learningId) {
      Learnings.remove(learningId);
    },
    setChecked: function (learningId, setChecked) {
      Learnings.update(learningId, { $set: { checked: setChecked} });
    }

  });

  Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
  });
  Meteor.publish("learnings", function() {
    return Learnings.find();
  });


}
