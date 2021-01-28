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
  GitHubCore.info(latestRelease.tag_name);
  GitHubCore.info(latestRelease.name);
  GitHubCore.info(latestRelease.body);
  GitHubCore.info(latestRelease.url);

  return releases[0];
};
