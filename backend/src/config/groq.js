import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Change model here once to affect all agents
// llama-3.1-8b-instant   → fast, low token usage (good for free tier)
// llama-3.3-70b-versatile → best quality, high token usage
export const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export default groq;
