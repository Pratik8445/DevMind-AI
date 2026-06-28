import groq, { MODEL } from "../config/groq.js";

export async function backendAgent(
  requirements,
  architecture
) {

  const prompt = `
You are a Senior Backend Engineer.
Based on the following generate a concise backend design:

REQUIREMENTS SUMMARY:
${requirements.slice(0, 800)}

ARCHITECTURE SUMMARY:
${architecture.slice(0, 800)}

Generate:
1. Backend Folder Structure (tree format)
2. Database Models (name, key fields)
3. Controllers (list files)
4. Routes (list files)
5. APIs (method + endpoint)

Return in clean markdown. Use tree format for folders.
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

  return response
    .choices[0]
    .message
    .content;
}