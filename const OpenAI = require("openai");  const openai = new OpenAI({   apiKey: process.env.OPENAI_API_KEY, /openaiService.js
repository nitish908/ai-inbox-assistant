const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Get API key from environment variables
});

async function summarizeEmail(emailContent) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Summarize this email in 1-2 sentences.",
        },
        {
          role: "user",
          content: emailContent,
        },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("OpenAI error:", err.response ? err.response.data : err);
    throw new Error("Something went wrong with OpenAI");
  }
}

module.exports = { summarizeEmail };
