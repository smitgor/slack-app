// Placeholder for AI Backend Interaction

/**
 * Simulates creating a Jira ticket via an AI backend.
 * @param {string} summary - The summary of the Jira ticket.
 * @param {string} description - The description of the Jira ticket.
 * @param {string} issueType - The type of the issue (e.g., 'Task', 'Bug').
 * @param {string} [projectId] - Optional project ID for the ticket.
 * @returns {Promise<object>} A promise that resolves with the mock response from the AI backend.
 */
async function createJiraTicket(summary, description, issueType = 'Task', projectId = null) {
  console.log(`AI Interaction: Attempting to create Jira ticket:`);
  console.log(`  Summary: ${summary}`);
  console.log(`  Description: ${description}`);
  console.log(`  Issue Type: ${issueType}`);
  if (projectId) {
    console.log(`  Project ID: ${projectId}`);
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock response
  if (!summary || !description) {
    return {
      success: false,
      error: 'Summary and Description are required.',
      ticketId: null,
    };
  }

  const mockTicketId = `JIRA-${Math.floor(Math.random() * 9000) + 1000}`;
  console.log(`AI Interaction: Mock ticket ${mockTicketId} created successfully.`);
  return {
    success: true,
    message: `Successfully created ticket ${mockTicketId}.`,
    ticketId: mockTicketId,
    details: {
      summary,
      description,
      issueType,
      projectId,
      status: 'Open',
    }
  };
}

/**
 * Simulates fetching Jira ticket information via an AI backend.
 * @param {string} ticketIdOrQuery - The Jira ticket ID or a search query.
 * @returns {Promise<object>} A promise that resolves with the mock response from the AI backend.
 */
async function getJiraTicketInfo(ticketIdOrQuery) {
  console.log(`AI Interaction: Attempting to get Jira ticket info for: ${ticketIdOrQuery}`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock response
  if (!ticketIdOrQuery) {
    return {
      success: false,
      error: 'Ticket ID or query is required.',
      data: null,
    };
  }

  // Simple mock: if it looks like a JIRA ID, return some mock data
  if (ticketIdOrQuery.toUpperCase().startsWith('JIRA-')) {
    console.log(`AI Interaction: Mock data found for ${ticketIdOrQuery}.`);
    return {
      success: true,
      data: {
        id: ticketIdOrQuery.toUpperCase(),
        summary: `Mock summary for ${ticketIdOrQuery}`,
        description: 'This is a mock description fetched from the AI backend.',
        status: 'In Progress',
        assignee: 'ai_agent_dev',
        reporter: 'slack_user',
      },
    };
  } else {
    console.log(`AI Interaction: No mock data found for query: ${ticketIdOrQuery}. Simulating a search.`);
    // Simulate a search returning multiple items or a specific item
    return {
        success: true,
        message: `Query processed. Found 1 matching ticket for '${ticketIdOrQuery}'.`, // Or "No tickets found."
        data: [{ // Simulating a search result
            id: `JIRA-${Math.floor(Math.random() * 9000) + 1000}`,
            summary: `Searched: ${ticketIdOrQuery} - A relevant task`,
            status: 'Open'
        }]
    };
  }
}

module.exports = {
  createJiraTicket,
  getJiraTicketInfo,
};
