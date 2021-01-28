'use strict';

module.exports.divider = {
  type: 'divider'
};

module.exports.link = (text, url) => {
  return `<${url}|${text}>`;
};

module.exports.getTextBlock = text => {
  return {
    type: 'mrkdwn',
    text: text
  }
};

module.exports.sectionWithText = text => {
  return [
    {
      type: 'section',
      text: this.getTextBlock(text)
    },
    this.divider
  ]
};
