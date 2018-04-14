Template.layout.events({
  "click .continue-popup": function(event, template){
    event.preventDefault();
    if (!Meteor.userId()) {
      sweetAlert({
        imageUrl: '/images/slack-signin-example.jpg',
        imageSize: '140x120',
        title: TAPi18n.__("you_are_almost_there"),
        html: TAPi18n.__("continue_popup_text"),
        showCancelButton: true,
        confirmButtonText: TAPi18n.__("continue_with_slack"),
        cancelButtonText: TAPi18n.__("not_now"),

      },
      function(){
        var options = {
          requestPermissions: ['identity.basic', 'identity.email']
        };
        Meteor.loginWithSlack(options);
      });
    }

  }
});
