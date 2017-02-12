Template.hangoutFrame.onCreated(function() {
	this.autorun(() => {
		console.log('append jitsi script');
		$('head').append('<script src="https://meet.jit.si/external_api.js"></script>');
	});
});


