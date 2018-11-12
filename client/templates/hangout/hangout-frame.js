Template.hangoutFrame.onCreated(function() {
  let instance = this;
  instance.room = new ReactiveVar(`cb${instance.data._id || instance.data.hroom}`);

  instance.autorun(() => {
    instance.subscribe("hangoutParticipants", instance.room.get());
  });

  /**
   * Initialize Jitsi
   * @function
   * @name loadJitsi
   * @param {data.room} room - The hangout _id.
   * @param {data.username} username - The username of the user.
   * @param {data.type} type - Hangout type (silent, teaching, collaboration).
   * @param {data.avatar} avatar - Avatar image of the user from Slack.
   */
  instance.loadJitsi = function(data) {
    const domain = "meet.jit.si";
    let room = "cb" + data.room;
    let width = "100%";
    let height = 550;
    let configOverwrite = { startWithVideoMuted: true };
    let interfaceConfigOverwrite = {};
    let htmlElement = document.getElementById("hangout-container");

    instance.api = new JitsiMeetExternalAPI(
      domain,
      room,
      width,
      height,
      htmlElement,
      configOverwrite,
      interfaceConfigOverwrite
    );

    instance.api.executeCommand("displayName", data.username);
    instance.api.executeCommand("toggleChat");
    instance.api.executeCommand("avatarUrl", data.avatar);
    let jitsiParticipants = instance.api.getNumberOfParticipants();

    $("[id^=" + "jitsiConference" + "]").css("width", "100%");
    //only show the launch hangout button if Jitsi is not loaded
    $("[id^=" + "jitsiConference" + "]").length == 1 ? $(".load-hangout").hide() : $("#load-hangout").show();

    instance.api.on("readyToClose", () => {
      Bert.alert({
        type: "success",
        message: "Thanks for joining the hangout!",
        hideDelay: 3500
      });
      FlowRouter.go("all study groups");
    });

    Meteor.call("joinParticipant", room, function(error, result) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  };

  /**
   * Dispose of Jitsi
   * @function
   * @name disposeJitsi
   */
  instance.disposeJitsi = function() {
    instance.api.dispose();
  };
});

Template.hangoutFrame.onRendered(function() {
  /**
   * Display warning if
   * user is not using
   * Chrome or Firefox
   */

  if ((!!window.chrome && !!window.chrome.webstore) || typeof InstallTrigger !== "undefined") {
    //console.log('using firefox or chrome')
    $("p.chrome-firefox-warning").hide();
  } else {
    //console.log('a different browser')
    $("p.chrome-firefox-warning").show();
  }

  //Google Hangout support
  $("head").append('<script src="https://apis.google.com/js/platform.js" async defer></script>');
});

Template.hangoutFrame.events({
  "click .load-hangout": function(event, template) {
    const data = {
      room: this._id || template.data.hroom,
      username: (Meteor.user() && Meteor.user().username) || template.data.huser,
      type: template.data.htype || this.type,
      avatar: template.data.havatar || Meteor.user().profile.avatar.default
    };
    return template.loadJitsi(data);
  },
  "click #joinHere": function(event, template) {
    const hangout_id = `cb${this._id || template.data.hroom}`;

    Meteor.call("joinParticipant", hangout_id, function(error, result) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  }
});

Template.hangoutFrame.helpers({
  numParticipants: function() {
    const appState = AppStats.findOne({ _id: Template.instance().room.get() });
    // Check if this page has `coworking` in its URL
    const isCoworkingPg = window.location.pathname.indexOf("coworking") > -1;
    // Hide message on `/coworking` page
    if (appState && appState.participants && !isCoworkingPg) {
      return appState.participants.length;
    }
    return 0;
  },
  room: function() {
    return Template.instance().room.get();
  }
});

Template.hangoutFrame.onDestroyed(function() {
  const hangoutId = Template.instance().room.get();
  if (hangoutId) {
    Meteor.call("leaveParticipant", hangoutId);
  }
});
