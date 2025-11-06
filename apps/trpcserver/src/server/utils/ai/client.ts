import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your API key in environment variables
});
