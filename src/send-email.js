'use strict';

const sgMail = require('@sendgrid/mail');
const showdown  = require('showdown');
const request = require('request');
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
  // GitHubCore.info('1: Send Email');
  try {
    sgMail.setApiKey(sendgridToken);
  } catch (err) {
    GitHubCore.setFailed(`Failed when try to set SendGrid API, error: ${err}`);
  }

  // GitHubCore.info('2: Send Email');
  const converter = new showdown.Converter();

  const emailSubject = `New ${repoObject.repo} release: ${repoObject.description} (${repoObject.name})`;
  const footer = `
![PC Logo][pc-logo]

# ${emailSubject}
## Where to find the release?
[Visit the release page](${repoObject.url})

[pc-logo](https://my.paycertify.com/assets/images/paycertify-757cdf1128914f062b5d30dca4ff8751.svg)
  `;

  // GitHubCore.info('3: Send Email');
  const html = converter.makeHtml(`${repoObject.description}${footer}`);

  GitHubCore.info(`4: Send Email ${recipients} and ${recipients.split(',')}`);
  const msg = {
    to: ['subscribers@no-reply.com'], // change to engineering@paycertify.com
    from: {
      name: `${repoObject.repo} Release Notifier`,
      email: 'elias@paycertify.com'
    },
    bcc: recipients.split(','),
    subject: emailSubject,
    html
  };
  GitHubCore.info(`5: Send Email, ${msg.bcc[0]} and ${msg.bcc[1]}`);

  GitHubCore.info('6: Send Email');
  return sendEmails(msg, GitHubCore);

  
  // request.get(recipients, async (error, response, body) => {
  //   if (error) {
  //     console.error(error);

  //     process.exit(1);
  //   }

  //   return sendEmails(prepareMessage(body.split(/\r\n|\n|\r/)), GitHubCore);
  //   // return sendEmails('test');
  // });
};
