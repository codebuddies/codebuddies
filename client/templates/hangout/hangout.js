import QuillEditor from '../../libs/QuillEditor';

Meteor.startup(function() {
    $('head').append('<link href="https://cdn.quilljs.com/1.0.3/quill.snow.css" rel="stylesheet">');
});

Template.hangout.onCreated(function() {
  var title = "CodeBuddies | Hangout";
  DocHead.setTitle(title);

  this.subscribe("hangoutById", FlowRouter.getParam('hangoutId'));
});

Template.hangout.rendered = function() {

  $('head').append('<script src="https://apis.google.com/js/platform.js" async defer></script>');

}

Template.hangout.helpers({
  formatDescription: ({description}) => {
    return QuillEditor.generatePreview(description);
  },
  hangout: function() {
      return Hangouts.findOne({_id: FlowRouter.getParam('hangoutId')});
  },
  getType: function(type) {
    if (type == 'silent') {
      return 'fa-microphone-slash text-danger-color';
    } else if (type == 'teaching') {
      return 'fa-user text-warning-color';
    } else if (type == 'collaboration') {
      return 'fa-users text-success-color';
    }
  },
  getHostId: function(hangout) {
    return hangout.host.id;
  },
  getHostName: function(hangout) {
    return hangout.host.name;
  },
  getDate: function(hangout) {
    var tz = TimezonePicker.detectedZone();
    //console.log('getDate tz: ' + tz);
    //console.log('getDate hangout.start: '+ hangout.start);
    //console.log('getDate hangout.end: '+ hangout.end);
    //console.log('getDate this.timestamp' + this.timestamp);
    //console.log('getDate this.end' + this.end)
    return moment(hangout.start).tz(tz).format('ddd MMMM Do YYYY, h:mm a z') +
      ' - ' +
      moment(hangout.end).tz(tz).format('MMMM Do h:mm a z') +
      ' | ' +
      hangout.users.length +
      ' joined';
  },
  isInProgress: function(hangout) {

    var hangout_links = {
      'http://codebuddies.org/javascript-hangout': 'free',
      'http://codebuddies.org/meteor-hangout': 'free',
      'http://codebuddies.org/python-hangout': 'free'
    }

    return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;

    //return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;

  },
  completed: function(hangout) {
        return reactiveDate.nowMinutes.get() > hangout.end;
  },
  isJoined: function() {
    return this.users.indexOf(Meteor.userId()) != -1;
  },

  upcomingTime: function(hangout) {
    var startDate = new Date(hangout.start);
    var currentDate = new Date();
    if (startDate > currentDate) {
          return TAPi18n.__("upcoming_time", {
          time: moment(startDate).fromNow()
        });
    }

  },
  getIsDone: function(hangout) {
    var currentDate = new Date();
    //console.log('getIsDone currentDate:' + currentDate);
    var hangoutDate = new Date(hangout.end);
    if (hangoutDate < currentDate) {
      var daysDiff = Math.round((currentDate - hangoutDate) / (1000 * 60 * 60 * 24));
      if (daysDiff == 0)
        return TAPi18n.__("mastered_today_time", {
          time: moment(hangoutDate).fromNow()
        });
      else
        return TAPi18n.__("mastered_x_days_ago", {
          days: daysDiff
        });
    } else {
      return '';
    }
  }
});
Template.hangout.events({
  'click #join-hangout': function() {
    if (!Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("you_are_almost_there"),
        text: TAPi18n.__("login_join_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'info'
      });
    } else {

      const data = {
        hangoutId: this._id,
        hostId: this.host.id,
      }

      Meteor.call('addUserToHangout', data, function(error, result) {
        if (result) {
          sweetAlert({
            title: TAPi18n.__("you_are_awesome"),
            text: TAPi18n.__("looking_forward_to_see_you"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'info'
          });
        }
      });
    }
  },
  'click #leave-hangout': function() {
    if (this.host.id == Meteor.userId()) {
      sweetAlert({
        title: TAPi18n.__("remove_owner_from_hangout"),
        confirmButtonText: TAPi18n.__("ok"),
        type: 'warning'
      });
    } else {

      const data = {
        hangoutId: this._id,
        hostId: this.host.id,
      }

      Meteor.call('removeUserFromHangout', data, function(error, result) {
        if (result) console.log('removed');
      });
    }
  },
});
