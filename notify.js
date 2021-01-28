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

const sgMail = require('@sendgrid/mail');

const getSlackMessage = require('./src/get-slack-message');
const postMessage = require('./src/post-message');
const prefixError = require('./src/prefix-vendor-error-message');

// const showdown  = require('showdown');
// const fs = require('fs');
const request = require('request');

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

const sendEmails = async (msg) => {
  return sgMail
    .send(msg)
    .then(() => {
      console.log("Mail sent!")
    })
    .catch(error => {
      console.error(error.toString())

      // //Extract error msg
      // const { message, code, response } = error

      // //Extract response msg
      // const { headers, body } = response
    });
}


module.exports.run = async () => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_TOKEN);
  } catch (err) {
    GitHubCore.setFailed(`Failed when try to set SendGrid API, error: ${err}`);
  }

  let message = '';
  
  try {
    const gitHubToken = GitHubCore.getInput('github-token') || process.env.GITHUB_TOKEN;
    // const Octokit = new GitHubClient(gitHubToken);
    const Octokit = github.getOctokit(gitHubToken);
    const { owner, repo } = context.repo;

    message = await getSlackMessage(Octokit, owner, repo);

    GitHubCore.info('Message built');
  } catch (err) {
    GitHubCore.setFailed(prefixError(err, 'GitHub'));

    return;
  }

  try {
    const slackToken = GitHubCore.getInput('slackbot-token') || process.env.SLACK_TOKEN;
    const Slack = new SlackWebClient(slackToken);
    const slackConversationId = GitHubCore.getInput('slack-conversation-id') || process.env.SLACK_CONVERSATION_ID;
    await postMessage(Slack, slackConversationId, message);

    GitHubCore.info('Slack message posted');
  } catch (error) {
    GitHubCore.setFailed(prefixError(error, 'Slack'));
  }

  try {
    const recipients = GitHubCore.getInput('email-recipients') || process.env.RECIPIENTS;

    // eslint-disable-next-line no-unused-vars
    request.get(recipients, async (error, response, body) => {
      if (error) {
        console.error(error);

        process.exit(1);
      }

      // return sendEmails(prepareMessage(body.split(/\r\n|\n|\r/)));
      return sendEmails('test');
    });
  } catch (error) {
    GitHubCore.setFailed(error);
  }
}
