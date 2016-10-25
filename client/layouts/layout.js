Template.layout.events({
  "click .continue-popup": function(event, template){
    if (!Meteor.userId()) {
      sweetAlert({
        text:  TAPi18n.__("continue_popup_text") ,
        showCancelButton: true,
        confirmButtonText: TAPi18n.__("continue_with_slack"),
        cancelButtonText: TAPi18n.__("not_now"),

      },
      function(){
        var options = {
          requestPermissions: ['identify', 'users:read']
        };
        Meteor.loginWithSlack(options);
      });
    }

  }
});
