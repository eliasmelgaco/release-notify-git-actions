'use strict';

const GitHubCore = require('@actions/core');

module.exports = async (Octokit, owner, repo) => {
  const { data: releases } = await Octokit.repos.listReleases({ owner, repo });

  GitHubCore.info('inside get-lated-pull-request.js');
  GitHubCore.info(releases);
  GitHubCore.info(releases[0]);

  return releases[0];
};
