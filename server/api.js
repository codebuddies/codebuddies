Meteor.methods({

  userProfileImage: function(userId) {
    check(userId, String);
    if (userId != '') {
      var user = Meteor.users.findOne({_id: userId});
      return user.user_info.profile.image_192;
    } else {
      return '';
    }
  },

  getUserName: function(userId) {
    check(userId, String);
    if (userId != '') {
      var user = Meteor.users.findOne({_id: userId});
      return user.user_info.name;
    } else {
      return 'unknown';
    }
  },

  getUserCount: function() {
    return Meteor.users.find().count();
  },

  getHangoutsJoinedCount: function() {
    return Hangouts.find({users:{$elemMatch:{$eq:this.userId}}}).count();
  },

  emailHangoutUsers: function(hangoutId) {
    // ssr for email template rendering
    SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-alerts.html'));

    var tz = "America/Los_Angeles";
    var hangout = Hangouts.findOne(hangoutId);
    var user_id = hangout.user_id;
    var host = Meteor.users.findOne({_id: user_id}).user_info.name;
    var hangout_topic = hangout.topic;
    var hangout_start_time = hangout.start;
    var emails = hangout.email_addresses.join(",");

    var template_data = {
      hangout_topic: hangout_topic,
      host: host,
      hangout_start_time: moment(hangout_start_time).tz(tz).format('MMMM Do YYYY, h:mm a z'),
      logo: Meteor.absoluteUrl('images/cb2-180.png')
    };


    var data = {
      to: emails,
      from: Meteor.settings.email_from,
      html: SSR.render('notifyEmail', template_data),
      subject: 'CodeBuddies Alert: Hangout - ' + hangout_topic + ' has been CANCELLED'
    }
    // let other method calls from same client to star running.
    // without needing to wait to send email
    this.unblock();

    try {
      Email.send(data);
    } catch ( e ) {
      //debug
      console.log("Email.send() error: " + e.message);
      return false;
    }
    return true;
  },

  createHangout: function(data) {
    check(data, Match.ObjectIncluding({
      user_id: String,
      topic: String,
      description: String,
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      type: String,
      username:String,
      email:String
    }));

    var hangout_id = Hangouts.insert({
      user_id: data.user_id,
      creator:data.username,
      topic: data.topic,
      description: data.description,
      start: data.start,
      end: data.end,
      type: data.type,
      users: [ data.user_id ],
      email_addresses: [ data.email ],
      reminder_sent: false,
      timestamp: new Date()
    });
    // create slack message to channel
    var tz = "America/Los_Angeles";
    var host = data.username;
    var hangout_type = data.type;
    var hangout_topic = data.topic;
    var hangout_desc = data.description;
    var hangout_url = Meteor.absoluteUrl('hangout'); // http://<ROOT_URL>/hangout/<hangout_id>
    var start_time = moment(data.start).tz(tz).format('MMMM Do YYYY, h:mm a z');
    var data = {
      attachments: [
        {
          fallback: 'A new hangout has been scheduled. Visit' + Meteor.absoluteUrl() + '',
          color: '#1e90ff',
          pretext: `A new *${hangout_type}* hangout has been scheduled by <@${host}>!`,
          title: `${hangout_topic}`,
          title_link: `${hangout_url}/${hangout_id}`,
          mrkdwn_in: ['text', 'pretext', 'fields'],
          fields: [
            {
              title: 'Description',
              value: `_${hangout_desc}_`,
              short: true
            },
            {
              title: 'Date',
              value: `${start_time}`,
              short: true
            }
            ]
        }
        ]
    }
    // send Slack message to default channel (configured in Meteor settings)
    /* global hangoutAlert from /lib/functions.js */
    hangoutAlert(data);
    return true;
  },

  deleteHangout: function (hangoutId) {
    check(hangoutId, String);
    var response = Meteor.call('emailHangoutUsers', hangoutId);
      if (!response) {
          throw new Meteor.Error("Error sending email!");
      } else {
          Hangouts.remove({_id: hangoutId, user_id: this.userId});
          return true;
      }
  },

  editHangout: function(data, hangoutId) {
    check(data, Match.ObjectIncluding({
      topic: String,
      description: String,
      start: Match.OneOf(String, Date),
      end: Match.OneOf(String, Date),
      type: String
    }));

    Hangouts.update({_id: hangoutId, user_id: this.userId},
      {$set:
        {
         topic: data.topic,
         description: data.description,
         start: data.start,
         end: data.end,
         type: data.type
      }
    });
    return true;
  },
  cloneHangout: function(data, hangoutId) {
    check(data, Match.ObjectIncluding({
      user_id: String,
      topic: String,
      username: String,
      description: String,
      type: String
    }));
    var user = Meteor.users.findOne({_id: data.user_id});
    var user_email = user.user_info.profile.email;
    Hangouts.insert({
      user_id: data.user_id,
      creator:data.username,
      topic: data.topic,
      description: data.description,
      start: data.start,
      end: data.end,
      type: data.type,
      users: [ data.user_id ],
      email_addresses: [ user_email ],
      timestamp: new Date()
    });
    return true;
  },

  setUserStatus: function(currentStatus) {
    check(currentStatus, String);
    Meteor.users.update({_id: Meteor.userId()}, {$set: {statusMessage: currentStatus, statusDate: new Date()}});
  },

  setHangoutStatus: function(hangoutStatus) {
    check(hangoutStatus, String);
    Meteor.users.update({_id: Meteor.userId()}, {$set: {statusHangout: hangoutStatus}});
  },

  addLearning: function(learningStatus) {
    check(learningStatus, String);
    Learnings.insert({
      text: learningStatus,
      owner: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().profile.name,
      timestamp: new Date(),
      kudos: 0
    });
  },

  deleteLearning: function(learningId) {
    check(learningId, String);
    Learnings.remove( { _id: learningId, owner: this.userId } );
    return true;
  },

  editLearning: function(learning, learningId) {
    check(learningId, String);
    check(learning, String);
    Learnings.update(
      { _id: learningId, owner: this.userId }, {$set: {text: learning}}
    );
    return true;
  },

  incrementKudoCount: function(learningItemId) {
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: 1 },
        $push: { hasLiked: this.userId }
      }
    );
  },

  decrementKudoCount: function(learningItemId) {
    Learnings.update(
      { _id: learningItemId },
      {
        $inc: { kudos: -1 },
        $pull: { hasLiked: this.userId }
      }
    );
    return true;
  },

  getHangout: function(hangoutId) {
    check(hangoutId, String);
    return Hangouts.findOne(hangoutId);
  },

  getHangoutsCount: function() {
    return {hangoutsCount: Hangouts.find({}).count()};
  },

  addUserToHangout: function(hangoutId, userId) {
    check(hangoutId, String);
    check(userId, String);
    var user = Meteor.users.findOne({_id: userId});
    var user_email = user.user_info.profile.email;
    Hangouts.update({ _id: hangoutId },
      { $push: { users: userId, email_addresses: user_email }});
    return true;
  },

  removeUserFromHangout: function(hangoutId, userId) {
    check(hangoutId, String);
    check(userId, String);
    Hangouts.update({ _id: hangoutId },
      { $pull: { users: userId } });
    return true;
  }

});
