
Template.userAccountSettings.helpers({

});

Template.userAccountSettings.events({
  "click #deleteMyAccount": function(event, template){
    Modal.show('deleteMyAccountModal');
    
  }
});
