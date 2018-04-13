import { Meteor } from 'meteor/meteor';
import { SSR } from 'meteor/meteorhacks:ssr';
import { Email } from 'meteor/email';

/**
* CBNotifier globle notifier.
* @function
* @name CBMailer
* @param { Object } mail_data - sender receiver information
* @param { String } template_name - which template to use
* @param { Object } template_data - template_data
*/
export const CBMailer = function(mail_data, template_name, template_data) {

  Meteor.settings.public.isModeDebug ? console.log(`inside mailer ${template_name}`) : null;

  SSR.compileTemplate(`${template_name}`, Assets.getText(`templates/email/${template_name}.html`));

  const mail = {
    to: mail_data.to,
    from: mail_data.from,
    subject: mail_data.subject,
    html: SSR.render(template_name, template_data)
  }

  try {
    Email.send(mail);
  } catch (e) {
    console.log(e);
  }

}
