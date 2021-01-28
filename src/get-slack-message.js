'use strict';

// const slackBlockKit = require('./slack-helpers');
// const prefixError = require('./prefix-vendor-error-message');
const latestPullRequest = require('./get-latest-pull-request');

// const getRepoURL = (repoObject) => {
//   return `*${slackBlockKit.link(repoObject.full_name, repoObject.html_url)}*`;
// };

// const parseEmptyPullRequests = (repoObject) => {
//   const message = `${getRepoURL(repoObject)} has no open pull requests right now`;
//   return slackBlockKit.sectionWithText(message);
// };

// const parsePullRequests = (pullRequests) => {
//   const [{ head: { repo: repoObject } }] = pullRequests;
//   const head = `${getRepoURL(repoObject)} has the following PRs open:`;
//   const parsePR = pr => `- ${slackBlockKit.link(pr.title, pr.html_url)} by ${pr.user.login}\n`;
//   const body = pullRequests.map(parsePR).join('');

//   return slackBlockKit.sectionWithText(`${head}\n${body}`.trim());
// };

module.exports = async (Octokit, owner, repo) => {
  // const { data: pullRequests } = await Octokit.pulls.list({ owner, repo, state: 'open' });

  return latestPullRequest(Octokit, owner, repo);

  // if (!pullRequests.length) {
  //   const {data: repoObject} = await Octokit.repos.get({owner, repo});
  //   return parseEmptyPullRequests(repoObject);
  // }

  // return parsePullRequests(pullRequests);
};
