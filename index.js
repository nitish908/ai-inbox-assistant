const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/summarize", async (req, res) => {
  try {
    const emailContent = req.body.emailContent;

    if (!emailContent) {
      return res.status(400).json({ error: "Email content is required" });
    }

    const response = await axios.post(
      "https://api.aimlapi.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Summarize this email content: ${emailContent}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIML_API_KEY}`,
        },
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("AI/ML API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with the AI/ML API" });
  }
});

// Render health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Your server is live on port ${port}`);
});
