import axios from 'axios';

const geminiClient = axios.create({
  baseURL: 'https://api.google.com/gemini',
  headers: { 'Authorization': `Bearer ${process.env.GEMINI_API_KEY}` },
});

export default geminiClient;
