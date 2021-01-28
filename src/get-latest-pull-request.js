'use strict';

const GitHubCore = require('@actions/core');

module.exports = async (Octokit, owner, repo) => {
  const { data: releases } = await Octokit.repos.listReleases({ owner, repo });

  const [latestRelease] = releases;

  GitHubCore.info('inside get-lated-pull-request.js');
  // GitHubCore.info(releases);
  // GitHubCore.info(releases[0]);


  let properties = '';
  Object.getOwnPropertyNames(releases[0]).forEach((val) => {
    properties += `,${val}`;
  });

  GitHubCore.info(properties);
  // GitHubCore.info(latestRelease.tag_name); // v0.0.29
  // GitHubCore.info(latestRelease.name); // title 321321
  // GitHubCore.info(latestRelease.body); // description 123 123
  GitHubCore.info(latestRelease.html_url);
  GitHubCore.info(latestRelease.tarball_url);
  GitHubCore.info(latestRelease.zipball_url);

  return releases[0];
};
