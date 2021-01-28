'use strict';

const prefixError = require('./prefix-vendor-error-message');

module.exports = async (Slack, channel, blocks) => {
  try {
    const { ok } = await Slack.chat.postMessage({ channel, blocks });

    if (!ok) {
      throw new Error('Error posting message');
    }

    return true;
  } catch (error) {
    error.message = prefixError(error, 'Slack');

    throw error;
  }
};
