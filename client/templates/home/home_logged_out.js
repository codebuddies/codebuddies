Template.homeLoggedOut.onCreated(function(){
  var title = "CodeBuddies | Home";
  var metaInfo = {name: "description", content: "We're a community of people learning to code via peer-to-peer Google Hangouts. Learning with others helps us learn faster. The project is free and open-sourced."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

 Template.homeLoggedOut.rendered = function() {

 $('#hangout-tips').click(function() {
    Modal.show('hangoutTips');
  });

  $('.join-info').click(function() {
    Modal.show('joinInfo');
  });

  $(function() {
  		$('.hangout-details').hide();
		$('.hangout-card').hover(function() {
     		 $(this).find('.hangout-details').show();
     		 $(this).find('.hangout-image').hide();
     		 $(this).addClass('shadow-effect');
  		}, function(){
      		$(this).find('.hangout-details').hide();
     		 $(this).find('.hangout-image').show();
     		 $(this).removeClass('shadow-effect');
 		 });

    $('span.slack-text').text('Get Slack Invite');
   });


};


Template.homeLoggedOut.events({
  'click .signIn': function(event) {
    var options = {
      requestPermissions: ['identify', 'users:read']
    };
    Meteor.loginWithSlack(options);
  }
});



