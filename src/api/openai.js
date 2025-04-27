// openai.js
const API_KEY = import.meta.env.VITE_API_KEY;

export const getAssistantResponse = async (assistantId, prompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // openai model
        messages: [
          { role: 'system', 
            content: 
            `You are an assistant focused on ${assistantId}. Provide advice to homeowners and consumers.
            Be clear in the information you give the user but be brief, do not give too much unneccessary information. If someone asks for something simple you don't need to give them paragraphs of explanations.
          ` },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    return 'Sorry, I could not process your request.';
  }
};