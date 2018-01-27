Template.userAccountSettings.onCreated(function() {
  let instance = this;
  const title = "CodeBuddies | User Account Settings";
  DocHead.setTitle(title);

  // instance.flag = new ReactiveVar(false);
  instance.emails_preference = new ReactiveVar([]);
  instance.selected_email_preference = new ReactiveVar([]);
});

Template.userAccountSettings.onRendered(function () {
  let instance = this;


  instance.autorun(function(){
    const emails_preference = Meteor.user() && Meteor.user().emails_preference;
    if (emails_preference) {
      instance.emails_preference.set(emails_preference);
    }
  });


});

Template.userAccountSettings.helpers({
  emails_preference () {
    return Template.instance().emails_preference.get();
  },
  preferences_modified () {
    return Template.instance().selected_email_preference.get().length == Template.instance().emails_preference.get().length ;
  }
});

Template.userAccountSettings.events({
  "click #deleteMyAccount": function(event, template){
    Modal.show('deleteMyAccountModal');

  },
  'change [name="email_preference"]': function ( event, template ) {

    const selected_email_preference = template.findAll( "input[name=email_preference]:checked");
    let results = selected_email_preference.map((item)=>{
      return item.defaultValue;
    })

    template.selected_email_preference.set(results)
  },
  "click #updateEmailsPreference": function(event, template){

    const selected_emails_preference = template.findAll( "input[name=email_preference]:checked");
    let results = selected_emails_preference.map((item)=>{
      return item.defaultValue;
    })

    const data = {
      emails_preference: results
    }

    Meteor.call("updateEmailsPreference", data, function(error, result){
      if(error){
        return Bert.alert(error.reason, 'danger', 'growl-top-right');
      }
      if(result){
        return Bert.alert( 'Your preferences is updated!', 'success', 'growl-top-right' );
      }
    });
  },
});
