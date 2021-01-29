'use strict';

const sgMail = require('@sendgrid/mail');
const showdown  = require('showdown');
const prefixError = require('./prefix-vendor-error-message');

const sendEmails = async (msg, GitHubCore) => {
  return sgMail
    .send(msg)
    .then(() => {
      GitHubCore.info('Email sent');
    })
    .catch(err => {
      GitHubCore.setFailed(prefixError(err, 'SendGrid'));
    });
}


module.exports = async (sendgridToken, GitHubCore, repoObject, recipients) => {
  try {
    sgMail.setApiKey(sendgridToken);
  } catch (err) {
    GitHubCore.setFailed(`Failed when try to set SendGrid API, error: ${err}`);
  }

  const converter = new showdown.Converter();

  const emailSubject = `New ${repoObject.repo} release: ${repoObject.description} (${repoObject.name})`;
  const emailBody = `
![PC Logo][pc-logo]

# ${emailSubject}
## Where to find the release?
[Visit the release page](${repoObject.url})

[pc-logo]: https://my.paycertify.com/assets/images/paycertify-757cdf1128914f062b5d30dca4ff8751.svg
  `;

  const html = converter.makeHtml(emailBody);

  const msg = {
    to: ['subscribers@no-reply.com'], // change to engineering@paycertify.com
    from: {
      name: `Paycertify's Release Notifier`,
      email: 'elias@paycertify.com'
    },
    bcc: recipients.split(','),
    subject: emailSubject,
    html
  };

  return sendEmails(msg, GitHubCore);
};
