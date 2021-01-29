# PayCertify Release Notify Git Actions

[![Paycertify Logo](https://my.paycertify.com/assets/images/paycertify-757cdf1128914f062b5d30dca4ff8751.svg)](https://github.com/PayCertify)

A node.js project using Github Actions to send email and slack message (optional) when a new release is created.

### Libraries:
- [@actions/core](https://www.npmjs.com/package/@actions/core): Basic functions to define results, record, record secrets and export variables between actions
- [@actions/github](https://www.npmjs.com/package/@actions/github): A hydrated Octokit client. https://octokit.github.io/rest.js/v18/
- [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail): A Sendgrid API tool
- [@slack/web-api](https://www.npmjs.com/package/@slack/web-api): A Slack API tool

### requirements:

The repository should use [Github Release](https://docs.github.com/en/github/administering-a-repository/about-releases) feature

### Installation

As this project is a private Paycertify repository, you can use internally, just follow the yml example:

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
          repository: PayCertify/release-notify-git-actions
          token: ${{ secrets.ACTIONS_TOKEN }}
          path: ./.github/actions/release-notify

      - name: Install dependencies
        run: cd ./.github/actions/release-notify && npm i

      - name: Release Notify Git Actions
        uses: ./.github/actions/release-notify
        id: releaseStep
        with:
          github-token: ${{ secrets.ACTIONS_TOKEN }}
          slackbot-token: x
          slack-conversation-id: elias@paycertify.com
          sendgrid-token: ${{ secrets.SENDGRID_RELEASE_NOTIFY_TOKEN }}
          email-recipients: elias@paycertify.com,denis.toledo@paycertify.com
```

> Note: `email-recipients` should be split by `,`

> Note: You must ask the DevOps team for the secret keys to the project you are implementing.
