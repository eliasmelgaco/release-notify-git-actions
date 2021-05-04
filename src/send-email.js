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

  const emailSubject = `New ${repoObject.repo} release: ${repoObject.title}`;
  const emailBody = `
![PC Logo][pc-logo]

# ${emailSubject}
## Where to find the release?
# ${repoObject.description}
[Visit the release page](${repoObject.url})

{You can put message here}
  `;

  const html = converter.makeHtml(emailBody);

  const msg = {
    to: recipients.split(','), 
    from: {
      name: `Release Notifier`,
      email: 'email@company.com'
    },
    reply_to: {
      name: 'No Reply', 
      email: 'do-not-reply@company.com'
    },
    subject: emailSubject,
    html
  };

  return sendEmails(msg, GitHubCore);
};
