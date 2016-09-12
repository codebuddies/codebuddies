Template.registerHelper("userList", function(argument){
  switch (FlowRouter.getParam('sortUserAs')) {
    case "online":
      return "onlineUser";
      break;
    case "new":
      return "dailyNewUser";
      break;
    case "active":
      return "monthlyActiveUsers";
      break;
    case "archived":
      return "archivedUsers";
      break;
    default:

  }


});

Template.sortUserAs.events({
  "click #foo": function(event, template){

  }
});
