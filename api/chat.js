// Import Anthropic SDK
const Anthropic = require('@anthropic-ai/sdk');

// Your knowledge base data (we'll paste it here)
const KNOWLEDGE_BASE = {
  "entries": [
    // PASTE YOUR JSON DATA HERE
  ]
};

export default async function handler(req, res) {
  // Enable CORS so your website can talk to this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY, // We'll set this in Vercel
    });

    // Create the prompt with your knowledge base
    const systemPrompt = `You are a helpful study abroad advisor. You have access to detailed visa and study information for the following countries:

${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

When answering questions:
1. Be friendly and encouraging
2. Use the data from the knowledge base above
3. Format your responses clearly with bullet points when helpful
4. If asked about a country not in the database, politely say you don't have that information
5. Always include relevant fees, processing times, and requirements
6. Use emojis to make responses engaging (🎓 📚 ✈️ 💰 etc.)

Keep responses concise but informative.`;

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    // Extract the response text
    const botResponse = response.content[0].text;

    // Send back to the frontend
    return res.status(200).json({ 
      response: botResponse,
      success: true 
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response',
      details: error.message 
    });
  }
}