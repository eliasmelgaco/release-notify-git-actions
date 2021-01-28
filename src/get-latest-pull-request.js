'use strict';

const GitHubCore = require('@actions/core');

module.exports = async (Octokit, owner, repo) => {
  const { data: releases } = await Octokit.repos.listReleases({ owner, repo });

  GitHubCore.info('inside get-lated-pull-request.js');
  // GitHubCore.info(releases);
  // GitHubCore.info(releases[0]);


  let properties = '';
  Object.getOwnPropertyNames(releases[0]).forEach((val) => {
    properties += `,${val}`;
  });

  GitHubCore.info(properties);

  return releases[0];
};
