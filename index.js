'use strict';

const GitHubCore = require('@actions/core');
const github = require('@actions/github');
const { context } = github;
// const {
//   WebClient: SlackWebClient
// } = require('@slack/web-api');

const latestPullRequest = require('./src/get-latest-pull-request');
const sendEmail = require('./src/send-email');
// const getSlackMessage = require('./src/get-slack-message');
// const postMessage = require('./src/post-message');
const prefixError = require('./src/prefix-vendor-error-message');

async function run () {
  let Octokit;
  let owner;
  let repo;
  
  try {
    GitHubCore.info('Inside github try');
    const gitHubToken = GitHubCore.getInput('github-token');
    Octokit = github.getOctokit(gitHubToken);
    owner = context.repo.owner;
    repo = context.repo.repo;

    // GitHubCore.info(owner); // Organization
    // GitHubCore.info(repo); // release-notify-git-actions

    // const {
    //   url,
    //   name,
    //   title,
    //   description
    // } = await getSlackMessage(Octokit, owner, repo);


  } catch (err) {
    GitHubCore.setFailed(prefixError(err, 'GitHub'));

    return;
  }

  const repoObject = await latestPullRequest(Octokit, owner, repo);
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