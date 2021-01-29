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
  GitHubCore.info('1: Send Email');
  try {
    sgMail.setApiKey(sendgridToken);
  } catch (err) {
    GitHubCore.setFailed(`Failed when try to set SendGrid API, error: ${err}`);
  }

  GitHubCore.info('2: Send Email');
  const converter = new showdown.Converter();

  const emailSubject = `New ${repoObject.repo} release: ${repoObject.name} (${repoObject.tag_name})`;
  const footer = `
    ## Where to find the release?
    [Visit the release page](${repoObject.url})
  `;

  GitHubCore.info('3: Send Email');
  const html = converter.makeHtml(`${repoObject.description}${footer}`);

  GitHubCore.info('4: Send Email');
  const msg = {
    to: ['subscribers@no-reply.com'],
    from: {
      name: `${repoObject.repo} Release Notifier`,
      email: 'eliasmelgaco@gmail.com'
    },
    bcc: recipients.split(/\r\n|\n|\r/),
    subject: emailSubject,
    html
  };
  GitHubCore.info(`5: Send Email, ${msg.subject}`);

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
