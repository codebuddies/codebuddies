Meteor.methods({
  emailHangoutUsers: function(hangoutId) {
    // ssr for email template rendering
    SSR.compileTemplate('notifyEmail', Assets.getText('email-hangout-alerts.html'));

    const tz = "America/Los_Angeles";
    const hangout = Hangouts.findOne(hangoutId);
    const user_id = hangout.host.id;
    const host = hangout.host.name;
    const hangout_topic = hangout.topic;
    const hangout_start_time = hangout.start;

    if(hangout.attendees.length === 0)
    return true;

    const emails = hangout.email_addresses.join(",");

    const template_data = {
      hangout_topic: hangout_topic,
      host: host,
      hangout_start_time: moment(hangout_start_time).tz(tz).format('MMMM Do YYYY, h:mm a z'),
      logo: Meteor.absoluteUrl('images/cb2-180.png')
    };


    const data = {
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
      //console.log("Email.send() error: " + e.message);
      return false;
    }
    return true;
  }
});
