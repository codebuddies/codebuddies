import { CBMailer } from "/imports/libs/server/cb_mailer/";
import { Meteor } from "meteor/meteor";
import _ from "lodash";
import moment from "moment";

/**
 * send automatic welcome email to new users
 * @function
 * @name welcomeEmailToNewUsers
 */
function sendWelcomeMessage(user) {
  if (user && user.email) {
    const mail_data = {
      to: user.email,
      from: Meteor.settings.email_from,
      subject: "Welcome to Codebuddies"
    };

    // private/email/welcome_message.html
    const template_name = "welcome_message";

    const template_data = {};

    CBMailer(mail_data, template_name, template_data);
  } else {
    throw new Meteor.Error("welcomeEmailToNewUser.invalid-user", "Supplied user must have a valid email address.");
  }
}

export { sendWelcomeMessage };
