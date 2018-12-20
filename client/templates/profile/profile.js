Template.profile.onCreated(function() {
  var username = FlowRouter.getParam("name");
  var title = username + " | Profile";
  DocHead.setTitle(title);
  let myData = Meteor.users.find({}).fetch();
});

Template.profile.helpers({
  userInfo: function() {
    var userId = FlowRouter.getParam("userId");
    console.log(ReactiveMethod.call("getUserDetails", userId));
    return ReactiveMethod.call("getUserDetails", userId);
  },
  hangoutsJoinedCount: function() {
    var userId = FlowRouter.getParam("userId");
    return ReactiveMethod.call("getHangoutsJoinedCount", userId);
  },
  editMode: function() {
    return Session.get("editMode");
  },
  isCurrentUserProfile: function(currentUser) {
    return currentUser && currentUser._id == FlowRouter.getParam("userId");
  }
});

Template.profile.events({
  "click .editProfile": function() {
    Session.set("editMode", true);
  },
  "click #cancelProfileEdit": function() {
    Session.set("editMode", false);
  },
  "click .downloadData": function() {
    const csvString = Papa.unparse(Meteor.users.find({}).fetch()); // unparse generates CSV from your Object
    const a = document.createElement("a"); // create a simple link to a resource where your payload is your encoded CSV
    a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    a.download = "my_codebuddies_data.csv";
    a.click();
  },
  "click .loadConversation": function() {
    const data = {
      userId: FlowRouter.getParam("userId")
    };
    Meteor.call("conversation.getId", data, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        FlowRouter.go(`/conversation/${result}`);
      }
    });
  }
});
