Template.hangout.onCreated(function() {
	console.log('append jitsi script');
	$('head').append('<script src="https://meet.jit.si/external_api.js"></script>');
});