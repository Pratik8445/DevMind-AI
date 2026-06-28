import groq from "./config/groq.js";

async function test() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Say hello"
      }
    ]
  });

  console.log(response.choices[0].message.content);
}

test();