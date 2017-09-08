Template.hangoutFrame.onCreated(function() {
  let instance = this;

  /**
  * Initialize Jitsi
  * @function
  * @name loadJitsi
  * @param {data.room} room - The hangout _id.
  * @param {data.username} username - The username of the user.
  * @param {data.type} type - Hangout type (silent, teaching, collaboration).
  * @param {data.avatar} avatar - Avatar image of the user from Slack.
  */
  instance.loadJitsi = function(data){

    const domain = "meet.jit.si";
    let room = 'cb' + data.room;
    let width = '100%';
    let height = 550;
    let configOverwrite = { startVideoMuted: 0 };
    let interfaceConfigOverwrite = {};
    let htmlElement = document.getElementById("hangout-container");

    instance.api = new JitsiMeetExternalAPI(domain, room, width, height, htmlElement, configOverwrite, interfaceConfigOverwrite);


    instance.api.executeCommand('displayName', data.username);
    instance.api.executeCommand('toggleChat');
    instance.api.executeCommand('avatarUrl', data.avatar);
    let jitsiParticipants = instance.api.getNumberOfParticipants();

    $("[id^=" + 'jitsiConference' + "]").css('width', '100%');
    //only show the launch hangout button if Jitsi is not loaded
    $("[id^=" + 'jitsiConference' + "]").length == 1 ? $('.load-hangout').hide() : $('#load-hangout').show();
  }

  /**
  * Dispose of Jitsi
  * @function
  * @name disposeJitsi
  */
  instance.disposeJitsi= function(){
    instance.api.dispose();
  }

});

Template.hangoutFrame.onRendered(function() {
    /**
  * Display warning if
  * user is not using
  * Chrome or Firefox
  */

  if (!!window.chrome && !!window.chrome.webstore || typeof InstallTrigger !== 'undefined') {
    //console.log('using firefox or chrome')
    $('p.chrome-firefox-warning').hide();
  } else {
    //console.log('a different browser')
     $('p.chrome-firefox-warning').show();
  }

  //Google Hangout support
  $('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');
});

Template.hangoutFrame.events({
  'click .load-hangout': function(event, template){
    const data = {
      room: this._id,
      username: Meteor.user().username,
      type: this.type,
      avatar: Meteor.user().profile.avatar.default
    }
    return template.loadJitsi(data);
  }
});


Template.hangoutFrame.onDestroyed(function () {
  //Template.instance().disposeJitsi();
  //Remove for now (see: issue 461)
});
