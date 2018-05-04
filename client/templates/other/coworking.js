Template.coworking.onCreated(function() {
  let instance = this;
  instance.joinedHangout = false;
  instance.room = new ReactiveVar(`coworking`);

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
    let room = "codebuddies-silent-hangout";
    let width = "100%";
    let height = 400;
    let configOverwrite = { startVideoMuted: 1 };
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
    instance.api.executeCommand("avatarUrl", data.avatar);
    instance.api.executeCommand("toggleAudio");
    instance.api.executeCommand("toggleVideo");
    instance.api.executeCommand("toggleChat");
    instance.api.executeCommand("toggleShareScreen");

    $("[id^=" + "jitsiConference" + "]").css("width", "100%");
    //only show the launch hangout button if Jitsi is not loaded
    $("[id^=" + "jitsiConference" + "]").length == 1
      ? $(".load-hangout").hide()
      : $("#load-hangout").show();

    instance.api.on("readyToClose", () => {
      Bert.alert({
        type: "success",
        message: "Thanks for joining the hangout!",
        hideDelay: 3500
      });
      FlowRouter.go("all study groups");
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

Template.coworking.onRendered(function() {
  /**
   * Display warning if
   * user is not using
   * Chrome or Firefox
   */

  if (
    (!!window.chrome && !!window.chrome.webstore) ||
    typeof InstallTrigger !== "undefined"
  ) {
    //console.log('using firefox or chrome')
    $("p.chrome-firefox-warning").hide();
  } else {
    //console.log('a different browser')
    $("p.chrome-firefox-warning").show();
  }

  //Google Hangout support
  $("head").append(
    '<script src="https://apis.google.com/js/platform.js" async defer></script>'
  );
});

Template.coworking.events({
  "click .load-hangout": function(event, template) {
    const data = {
      room: this._id,
      username: Meteor.user().username,
      type: this.type,
      avatar: Meteor.user().profile.avatar.default
    };
    return template.loadJitsi(data);
  },
  "click .create-hangout-popup": function() {
    Modal.show("createHangoutModal");
  }
});

Template.coworking.onDestroyed(function() {
  //Template.instance().disposeJitsi();
  //Remove for now (see: issue 461)
  const joinedHangout = Template.instance().joinedHangout;
  if (joinedHangout && joinedHangout === true) {
    Meteor.call("leaveParticipant", Template.instance().room.get(), function(
      error,
      result
    ) {
      if (error) {
        return Bert.alert(error.reason, "danger", "growl-top-right");
      }
    });
  }
});
