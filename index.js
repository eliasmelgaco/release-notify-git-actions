'use strict';

const GitHubCore = require('@actions/core');
// const {
//   context: GitHubContext,
//   GitHub: GitHubClient
// } = require('@actions/github');
const github = require('@actions/github');
const { context } = github;
const {
  WebClient: SlackWebClient
} = require('@slack/web-api');

// const sgMail = require('@sendgrid/mail');

const latestPullRequest = require('./src/get-latest-pull-request');
const sendEmail = require('./src/send-email');
const getSlackMessage = require('./src/get-slack-message');
const postMessage = require('./src/post-message');
const prefixError = require('./src/prefix-vendor-error-message');

// const showdown  = require('showdown');
// const fs = require('fs');
// const request = require('request');

// const prepareMessage = (recipients) => {
//   const converter = new showdown.Converter();
//   const {
//     repository: {
//       repository: repoName
//     },
//     release: {
//       tag_name: releaseVersion,
//       name: releaseName,
//       html_url: releaseURL,
//       body: releaseBody
//     }
//   } = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));

//   // E-mail string templates
//   const emailSubject = `New ${repoName} release: ${releaseName} (${releaseVersion})`;
//   const footer = `
//     ## Where to find the release?
//     [Visit the release page](${releaseURL})
//   `;

//   const htmlBody = converter.makeHtml(`${releaseBody}${footer}`);

//   return {
//     to: ['subscribers@no-reply.com'],
//     from: {
//       name: `${repoName} Release Notifier`,
//       email: 'no-reply@no-reply.com'
//     },
//     bcc: recipients,
//     subject: emailSubject,
//     html: htmlBody
//   };
// }

// const sendEmails = async (msg) => {
//   return sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Mail sent!")
//     })
//     .catch(error => {
//       console.error(error.toString())

//       // //Extract error msg
//       // const { message, code, response } = error

//       // //Extract response msg
//       // const { headers, body } = response
//     });
// }


async function run () {
  // GitHubCore.info('Inside index.js function');

  // try {
  //   sgMail.setApiKey(process.env.sendgrid-token);
  // } catch (err) {
  //   GitHubCore.setFailed(`Failed when try to set SendGrid API, error: ${err}`);
  // }

  let Octokit;
  let owner;
  let repo;
  
  try {
    GitHubCore.info('Inside github try');
    const gitHubToken = GitHubCore.getInput('github-token');
    Octokit = github.getOctokit(gitHubToken);
    owner = context.repo.owner;
    repo = context.repo.repo;

    // GitHubCore.info(owner); // PayCertify
    // GitHubCore.info(repo); // release-notify-git-actions

    // const {
    //   url,
    //   name,
    //   title,
    //   description
    // } = await getSlackMessage(Octokit, owner, repo);


    // GitHubCore.info(url); // https://github.com/PayCertify/release-notify-git-actions/releases/tag/v0.0.30
    // GitHubCore.info(name); // v0.0.30
    // GitHubCore.info(title); // title v0.0.30
    // GitHubCore.info(description); // description related to v0.0.30

    // GitHubCore.info('Message built');
  } catch (err) {
    GitHubCore.setFailed(prefixError(err, 'GitHub'));

    return;
  }

  const repoObject = latestPullRequest(Octokit, owner, repo);

  GitHubCore.info(repoObject.url); // https://github.com/PayCertify/release-notify-git-actions/releases/tag/v0.0.30
  GitHubCore.info(repoObject.name); // v0.0.30
  GitHubCore.info(repoObject.title); // title v0.0.30
  GitHubCore.info(repoObject.description); // description related to v0.0.30

  const recipients = GitHubCore.getInput('email-recipients');
  const sendgridToken = GitHubCore.getInput('sendgrid-token');

  await sendEmail(sendgridToken, GitHubCore, repoObject, recipients);

  // try {
  //   const slackToken = GitHubCore.getInput('slackbot-token') ;
  //   const Slack = new SlackWebClient(slackToken);
  //   const slackConversationId = GitHubCore.getInput('slack-conversation-id');
  //   await postMessage(Slack, slackConversationId, message);

  //   GitHubCore.info('Slack message posted');
  // } catch (error) {
  //   GitHubCore.setFailed(prefixError(error, 'Slack'));
  // }

  // try {
  //   const recipients = GitHubCore.getInput('email-recipients');

  //   // eslint-disable-next-line no-unused-vars
  //   request.get(recipients, async (error, response, body) => {
  //     if (error) {
  //       console.error(error);

  //       process.exit(1);
  //     }

  //     // return sendEmails(prepareMessage(body.split(/\r\n|\n|\r/)));
  //     // return sendEmails('test');
  //     GitHubCore.info('testttt');
  //   });
  // } catch (error) {
  //   GitHubCore.setFailed(error);
  // }
}

run();