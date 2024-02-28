// pages/api/openai.js
import axios from 'axios';

const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openaiApiUrl = 'https://api.openai.com/v1';

export default async function handler(req, res) {
  if (!openaiApiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not found.' });
  }

  const { method, body } = req;

  switch (method) {
    case 'POST':
      try {
        const response = await axios.post(`${openaiApiUrl}/chat/completions`, {
          model: 'gpt-3.5-turbo', // Or any other supported model
          messages: [{ role: 'user', content: body.prompt }],
          temperature: body.temperature || 0.7,
          max_tokens: body.max_tokens || 60,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
        });

        return res.status(200).json(response.data);
      } catch (error) {
        return res.status(error.response.status).json(error.response.data);
      }
    default:
      return res.status(405).json({ error: 'Method not allowed.' });
  }
}
