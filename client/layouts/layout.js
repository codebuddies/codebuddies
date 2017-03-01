Template.layout.events({
  "click .continue-popup": function(event, template){
    event.preventDefault();
    if (!Meteor.userId()) {
      sweetAlert({
        html: '<b>' + TAPi18n.__("continue_popup_text") + '</b>',
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
