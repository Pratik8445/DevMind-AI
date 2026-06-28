import groq, { MODEL } from "../config/groq.js";

export async function pmAgent(idea) {

    const prompt = `
You are a Senior Product Manager.

Convert the following idea into:

1. Functional Requirements
2. User Stories
3. Acceptance Criteria

Idea:
${idea}

Return a professional software requirements document.
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
            temperature: 0.3
        });

    return response.choices[0].message.content;
}