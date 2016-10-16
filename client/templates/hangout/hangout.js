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
  formatDescription: ({description_in_quill_delta, description}) => {
    if (description_in_quill_delta) {
      return QuillEditor.generateHTMLForDeltas(description_in_quill_delta);
    } else {
      return description;
    }
  },
  getHostId: function(hangout) {
    return hangout.host.id;
  },
  getHostName: function(hangout) {
    return hangout.host.name;
  },
  hangout: function() {
      return Hangouts.findOne({_id: FlowRouter.getParam('hangoutId')});
  },
  isInProgress: function(hangout) {

    var hangout_links = {
      'http://codebuddies.org/javascript-hangout': 'free',
      'http://codebuddies.org/meteor-hangout': 'free',
      'http://codebuddies.org/python-hangout': 'free'
    }

    return reactiveDate.nowMinutes.get() > hangout.start && reactiveDate.nowMinutes.get() < hangout.end;
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
  "click #visitor": function(event, template){
    event.preventDefault();
    sweetAlert({
      title: TAPi18n.__("sign_in_to_continue"),
      confirmButtonText: TAPi18n.__("ok"),
      type: 'info'
    });
  },
  'click #end-hangout-button': function(){
    const topic = $('#hangout-topic').text().trim().split('\n')[0]
    const description = $('#hangout-description').text().trim()
    // Capturing the date in an array so that I can format it later
    const start_parts = $('.status').text().trim().split('\n')[6].trim().split('|')[0].split('-')[0].trim().split(" ")
    const end = new Date(Date.now())
    const type = $('.status').text().trim().split(' ')[0]

    // date: Weekday Month Day Year Time TimeZone
    var start = `${start_parts[0]} ${start_parts[1].substring(0,3)} ${start_parts[2].substring(0, start_parts[2].length - 2)} ${start_parts[3].substring(0, start_parts[3].length - 1)} ${start_parts[4]} ${start_parts[5]} ${start_parts[6]}`

    const data = {
       topic: topic,
       slug: topic.replace(/\s+/g, '-').toLowerCase(),
       description: description,
       start: new Date(start),
       end: new Date(end),
       type: type,
       hangoutId:Session.get("hangoutId"),
     };
     // Used for debugging:
     //alert(`${topic}-${description}-${start}-${end}-${type}`);

     Meteor.call('editHangout', data, function(err, result) {
        alert(err)
        alert(result)
        console.log(result);
        if (result) {
          sweetAlert({
            title: TAPi18n.__("hangout_edited_title"),
            text: TAPi18n.__("hangout_created_message"),
            confirmButtonText: TAPi18n.__("ok"),
            type: 'success',
            closeOnConfirm: true
          });
        } else {
          //console.log(err.reason);
          //console.log("there was an error");
          //console.log(data);
          //console.log(hangoutId);
        }
      });
  }
});
