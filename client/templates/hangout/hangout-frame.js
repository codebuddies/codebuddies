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
    let room = 'cb-' + data.room;
    let width = 500;
    let height = 550;
    let configOverwrite = { startVideoMuted: 0 };
    let interfaceConfigOverwrite = {};
    let htmlElement = document.getElementById("hangout-container");

    instance.api = new JitsiMeetExternalAPI(domain, room, width, height, htmlElement, configOverwrite, interfaceConfigOverwrite);
    
    instance.api.executeCommand('displayName', data.username);
    instance.api.executeCommand('toggleChat');
    instance.api.executeCommand('avatarUrl', data.avatar);
    instance.api.executeCommand('toggleShareScreen');

    $('#jitsiConference0').css('width', '100%');
    //only show the launch hangout button if Jitsi is not loaded
    $('#jitsiConference0').length == 1 ? $('.load-hangout').hide() : $('#load-hangout').show();
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
  Template.instance().disposeJitsi();
});
