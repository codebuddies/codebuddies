Template.hangoutFrame.onCreated(function() {
  let instance = this;
  instance.loadJitsi = function(){
    const domain = "meet.jit.si";
    let room = 'cb-' + $('span#post_id').text();
    let width = 500;
    let height = 550;
    let configOverwrite = {startVideoMuted: 0};
    let htmlElement = undefined;
    let api = new JitsiMeetExternalAPI(domain, room, width, height, htmlElement, configOverwrite);
    $('#jitsiConference0').appendTo('div#hangout-container').css('width','100%');
    //only show the launch hangout button if Jitsi is not loaded
    $('#jitsiConference0').length == 1 ? $('.load-hangout').hide() : $('#load-hangout').show();
  }
});

Template.hangoutFrame.events({
  'click .load-hangout': function(event, template){
    return Template.instance().loadJitsi();
  }
});
