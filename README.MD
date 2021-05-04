# Release Notify Git Actions

A node.js project using Github Actions to send email and slack message (optional) when a new release is created.

### Libraries:
- [@actions/core](https://www.npmjs.com/package/@actions/core): Basic functions to define results, record, record secrets and export variables between actions
- [@actions/github](https://www.npmjs.com/package/@actions/github): A hydrated Octokit client. https://octokit.github.io/rest.js/v18/
- [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail): A Sendgrid API tool
- [@slack/web-api](https://www.npmjs.com/package/@slack/web-api): A Slack API tool

### requirements:

The repository should use [Github Release](https://docs.github.com/en/github/administering-a-repository/about-releases) feature

### Installation

```ruby
name: Release
on:
  release:
    types: [published]

jobs:
  build:
    name: Release Notifier
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Release Notify Git Actions GH Action
        uses: actions/checkout@v2
        with:
          repository: eliasmelgaco/release-notify-git-actions
          token: ${{ secrets.ACTIONS_TOKEN }}
          path: ./.github/actions/release-notify

      - name: Install dependencies
        run: cd ./.github/actions/release-notify && npm i

      - name: Release Notify Git Actions
        uses: ./.github/actions/release-notify
        id: releaseStep
        with:
          github-token: ${{ secrets.ACTIONS_TOKEN }}
          slackbot-token: ${{ secrets.SLACK_TOKEN }}
          slack-conversation-id: ${{ secrets.SLACK_CONVERSATION_ID }}
          sendgrid-token: ${{ secrets.SENDGRID_RELEASE_NOTIFY_TOKEN }}
          email-recipients: ${{ secrets.EMAIL_RECIPIENTS }}
```

> Note: `email-recipients` should be split by `,`

> Note: You must ask the DevOps team for the secret keys to the project you are implementing.
