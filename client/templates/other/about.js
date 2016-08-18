Template.about.onCreated(function(){
  var title = "CodeBuddies | About";
  var metaInfo = {name: "description", content: "Our community spends a lot of time helping each other on Slack, but it's hard to schedule study times in advance in a chatroom, and it's also hard to know who else is online possibly working on the same thing at the same time. This website solves those issues."};
  DocHead.setTitle(title);
  DocHead.addMeta(metaInfo);
});

Template.about.onRendered(function(){
	$(function() {

	  //$('a.user-popover').popover({ trigger: "hover", html: "true" });
	  $('a.user-popover').each(function () {
        var $elem = $(this);
        $elem.popover({
            placement: 'top',
            trigger: 'hover',
            html: true,
            container: $elem,
            animation: false,
            title: 'Name goes here',
            content: 'This is the popover content. You should be able to mouse over HERE.'
        });
    });
	 });
});
