'use strict';

module.exports = async (Octokit, owner, repo) => {
  const { data: releases } = await Octokit.repos.listReleases({ owner, repo });

  const [ latestRelease ] = releases;

  const {
    tag_name: name,
    name: title,
    body: description,
    html_url: url
  } = latestRelease;

  // GitHubCore.info('inside get-lated-pull-request.js');

  // let properties = '';
  // Object.getOwnPropertyNames(releases[0]).forEach((val) => {
  //   properties += `,${val}`;
  // });

  // GitHubCore.info(properties); // v0.0.29


  // GitHubCore.info(latestRelease.tag_name); // v0.0.29
  // GitHubCore.info(latestRelease.name); // title 321321
  // GitHubCore.info(latestRelease.body); // description 123 123
  // GitHubCore.info(latestRelease.html_url); // https://github.com/PayCertify/release-notify-git-actions/releases/tag/v0.0.29

  return {
    url,
    name,
    title,
    description,
    repo
  }
};
