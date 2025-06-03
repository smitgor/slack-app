# Slack Jira Bot (Node.js)

This Slack application allows users to interact with Jira (via a future AI backend) using simple message commands.

## Prerequisites

- Node.js (version 14.x or later recommended)
- npm (usually comes with Node.js)
- A Slack Workspace where you can install apps.
- Permissions to create and configure Slack apps, or an administrator to do it for you.

## Setup and Configuration

1.  **Clone the Repository (or download the files):**
    ```bash
    # If this were a git repo, you'd clone it.
    # For now, ensure you have the slack_app directory.
    cd path/to/your/project/slack_app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `slack_app` directory by copying the example:
    ```bash
    cp .env_example .env
    ```
    Edit the `.env` file with your actual Slack app credentials:

    *   `SLACK_BOT_TOKEN`: Your bot token (starts with `xoxb-`).
        *   **Permissions Needed:** `chat:write` (to send messages).
    *   `SLACK_SIGNING_SECRET`: Your app's signing secret.
    *   `SLACK_APP_TOKEN`: Your app-level token for Socket Mode (starts with `xapp-`).
        *   **Socket Mode:** Ensure Socket Mode is enabled in your Slack app settings.
    *   `PORT`: The port on which the app will run (defaults to 3000 if not set).

    **Obtaining Slack Tokens & Enabling Socket Mode:**
    *   Go to [api.slack.com/apps](https://api.slack.com/apps).
    *   Create a new app or select an existing one.
    *   **Socket Mode:** Navigate to "Settings" > "Socket Mode" and enable it. Generate an app-level token (`SLACK_APP_TOKEN`).
    *   **OAuth & Permissions:** Navigate to "Features" > "OAuth & Permissions".
        *   Add the `chat:write` scope under "Bot Token Scopes".
        *   Install (or re-install) the app to your workspace to apply these scopes. You'll get your `SLACK_BOT_TOKEN`.
    *   **Basic Information:** Navigate to "Settings" > "Basic Information". Find your "Signing Secret" under "App Credentials".
    *   **Event Subscriptions:**
        *   Navigate to "Features" > "Event Subscriptions".
        *   Enable Events.
        *   Under "Subscribe to bot events", add the following:
            *   `message.channels`: To listen to messages in public channels the bot is part of.
            *   `message.groups`: To listen to messages in private channels the bot is part of.
            *   `message.im`: To listen to direct messages sent to the bot.
            *   `message.mpim`: To listen to messages in group direct messages the bot is part of.
        *   *Note:* The bot will process all messages it can see. If you only want it to respond when mentioned, you might add `app_mentions:read` and adjust the logic in `app.js` to check for mentions. For now, it processes messages like `jira create ...` directly.

4.  **Running the App:**
    ```bash
    node app.js
    ```
    You should see a message like: `⚡️ Bolt app is running on port 3000!`

## Available Commands

Send these commands in a direct message to the bot or in a channel where the bot has been added.

*   **Test Connection:**
    ```
    jira_test
    ```
    The bot will reply confirming it received the command.

*   **Create a Jira Ticket:**
    ```
    jira create <summary>; <description>[; <issueType>]
    ```
    -   `<summary>`: The summary or title of the Jira ticket.
    -   `<description>`: The detailed description of the Jira ticket.
    -   `[<issueType>]`: (Optional) The type of issue (e.g., "Task", "Bug", "Story"). Defaults to "Task" if not provided.
    *Example:*
    ```
    jira create Fix login button; The login button on the main page is broken after the last update.; Bug
    ```

*   **Get Jira Ticket Information:**
    ```
    jira get <ticket_id_or_query>
    ```
    -   `<ticket_id_or_query>`: The Jira ticket ID (e.g., `JIRA-123`) or a search term.
    *Example:*
    ```
    jira get JIRA-123
    ```
    ```
    jira get open login issues
    ```

## How it Works

-   The Slack app listens for specific message patterns (e.g., starting with "jira create").
-   It parses the command and its arguments.
-   It then calls mock functions in `aiInteraction.js` which simulate communication with a backend AI service for Jira operations.
-   The results (or errors) are sent back to the user in Slack.

## Future Development

-   Integrate with a real AI backend service.
-   More robust command parsing and argument handling.
-   Expanded set of Jira actions (e.g., update ticket, assign ticket, add comment).
-   User authentication/authorization for Jira actions.
```
