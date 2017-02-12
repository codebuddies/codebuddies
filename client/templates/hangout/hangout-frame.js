Template.hangoutFrame.onCreated(function() {
  let instance = this;

  instance.loadJitsi = function(data){

    const domain = "meet.jit.si";
    let room = 'cb-' + data.room;
    let width = 500;
    let height = 550;
    let configOverwrite = { startVideoMuted: 0 };
    let interfaceConfigOverwrite = {};
    let htmlElement = undefined;

    instance.api = new JitsiMeetExternalAPI(domain, room, width, height, htmlElement, configOverwrite, interfaceConfigOverwrite);
    instance.api.executeCommand('displayName', data.username);
    instance.api.executeCommand('toggleVideo');
    instance.api.executeCommand('toggleChat')
    instance.api.executeCommand('avatarUrl', data.avatar)

    $('#jitsiConference0').appendTo('div#hangout-container').css('width','100%');
    //only show the launch hangout button if Jitsi is not loaded
    $('#jitsiConference0').length == 1 ? $('.load-hangout').hide() : $('#load-hangout').show();
  }

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
