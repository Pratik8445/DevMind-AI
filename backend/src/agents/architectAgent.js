import groq, { MODEL } from "../config/groq.js";

export async function architectAgent(
    requirements
) {

    const prompt = `
You are a Senior Software Architect.
Based on the requirements below generate:
1. High Level Architecture
2. Recommended Tech Stack
3. Database Schema (key models only)
4. REST APIs (list endpoints)
5. Folder Structure (tree format)

Requirements:
${requirements.slice(0, 1500)}

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