// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/openai', {
        model: 'gpt-3.5-turbo',
        prompt,
        temperature: 0.7,
        max_tokens: 60,
      });

      setResult(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      <p style={{ color: 'white' }}>{result}</p>
    </div>
  );
}
