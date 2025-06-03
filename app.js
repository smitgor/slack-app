require('dotenv').config();
const { App } = require('@slack/bolt');
const { createJiraTicket, getJiraTicketInfo } = require('./aiInteraction');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // Enable Socket Mode
  appToken: process.env.SLACK_APP_TOKEN // Add app-level token
});

// Listen for all messages
app.message(async ({ message, say, logger }) => {
  // Ignore messages from bots
  if (message.bot_id) {
    return;
  }

  const text = message.text.trim();
  const sender = message.user; // User who sent the message

  try {
    if (text.toLowerCase().startsWith('jira create ')) {
      const parts = text.substring('jira create '.length).split(';');
      const summary = parts[0] ? parts[0].trim() : null;
      const description = parts[1] ? parts[1].trim() : null;
      const issueType = parts[2] ? parts[2].trim() : 'Task'; // Default to 'Task'

      if (!summary || !description) {
        await say({ text: `<@${sender}>: Usage: jira create <summary>; <description>[; <issueType>]` });
        return;
      }

      await say({ text: `<@${sender}>: Processing your request to create a Jira ticket... :hourglass_flowing_sand:` });
      const result = await createJiraTicket(summary, description, issueType);

      if (result.success) {
        await say({ text: `<@${sender}>: :white_check_mark: ${result.message}
Ticket ID: ${result.ticketId}
Details: \`\`\`${JSON.stringify(result.details, null, 2)}\`\`\`` });
      } else {
        await say({ text: `<@${sender}>: :x: Error creating ticket: ${result.error}` });
      }

    } else if (text.toLowerCase().startsWith('jira get ')) {
      const query = text.substring('jira get '.length).trim();

      if (!query) {
        await say({ text: `<@${sender}>: Usage: jira get <ticket_id_or_query>` });
        return;
      }

      await say({ text: `<@${sender}>: Fetching Jira ticket information for "${query}"... :hourglass_flowing_sand:` });
      const result = await getJiraTicketInfo(query);

      if (result.success) {
        if (result.data) {
          // Check if data is an array (search result) or object (single ticket)
          if (Array.isArray(result.data)) {
             if (result.data.length > 0) {
                let responseText = `<@${sender}>: :information_source: Found ${result.data.length} ticket(s) for "${query}":
`;
                result.data.forEach(ticket => {
                    responseText += `- \`${ticket.id}\`: ${ticket.summary} (Status: ${ticket.status})
`;
                });
                await say({ text: responseText });
             } else {
                await say({ text: `<@${sender}>: :information_source: No tickets found matching "${query}".` });
             }
          } else {
            // Single ticket details
            await say({ text: `<@${sender}>: :information_source: Ticket Information:
\`\`\`${JSON.stringify(result.data, null, 2)}\`\`\`` });
          }
        } else {
           await say({ text: `<@${sender}>: :information_source: ${result.message || 'No specific data returned.'}` });
        }
      } else {
        await say({ text: `<@${sender}>: :x: Error fetching ticket info: ${result.error}` });
      }
    } else if (text.toLowerCase() === 'jira_test') {
      // Keep the jira_test command for basic connectivity testing
      await say(`Hello <@${sender}>, your jira_test command was received! The app is listening.`);
    }
    // Other messages are ignored

  } catch (error) {
    logger.error('Failed to process message:', error);
    await say({ text: `<@${sender}>: Sorry, something went wrong while processing your request. :sadpanda:` });
  }
});

(async () => {
  // Start your app
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();
