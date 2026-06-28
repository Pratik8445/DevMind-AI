import groq, { MODEL } from "../config/groq.js";

export async function qaAgent(
  requirements,
  architecture,
  backend
) {

  const prompt = `
You are a Senior QA Engineer.
Based on the following generate a concise QA report:

REQUIREMENTS SUMMARY:
${requirements.slice(0, 600)}

ARCHITECTURE SUMMARY:
${architecture.slice(0, 600)}

BACKEND SUMMARY:
${backend.slice(0, 600)}

Generate:
1. Functional Test Cases (top 5)
2. API Test Cases (top 5)
3. Edge Cases (top 3)
4. Security Test Cases (top 3)
5. Performance Test Cases (top 3)

Be concise. Return in clean markdown.
`;

  const response =
    await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

  return response.choices[0].message.content;
}