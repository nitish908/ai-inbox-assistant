const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI with API Key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set this in Render's Environment Variables
});

app.get("/", (req, res) => {
  res.send("✅ AI Inbox API is running");
});

app.post("/summarize", async (req, res) => {
  const { emailContent } = req.body;

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

    res.json({ summary: response.choices[0].message.content.trim() });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong with OpenAI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
