'use strict';

const sgMail = require('@sendgrid/mail');
const showdown  = require('showdown');
const request = require('request');
const prefixError = require('./src/prefix-vendor-error-message');

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

  const emailSubject = `New ${repoObject.repo} release: ${repoObject.name} (${repoObject.tag_name})`;
  const footer = `
    ## Where to find the release?
    [Visit the release page](${repoObject.url})
  `;

  const html = converter.makeHtml(`${repoObject.description}${footer}`);

  const msg = {
    to: ['subscribers@no-reply.com'],
    from: {
      name: `${repoObject.repo} Release Notifier`,
      email: 'no-reply@no-reply.com'
    },
    bcc: recipients.split(/\r\n|\n|\r/),
    subject: emailSubject,
    html
  };

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
