require("dotenv").config(); // To load environment variables from the .env file
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 10000;

// Middleware
app.use(bodyParser.json());

// Endpoint to summarize email content using AI/ML API
app.post("/summarize", async (req, res) => {
  try {
    const emailContent = req.body.emailContent;

    if (!emailContent) {
      return res.status(400).json({ error: "Email content is required" });
    }

    // Use the AIML API to summarize the email content
    const response = await axios.post(
      "https://api.aimlapi.com/v1/chat/completions", // AI/ML API endpoint
      {
        model: "gpt-4o", // Change this to your chosen model
        messages: [
          {
            role: "user",
            content: `Summarize this email content: ${emailContent}`,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.AIML_API_KEY}`,
        },
      }
    );

    const summary = response.data.choices[0].message.content;

    res.json({ summary });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong with the AI/ML API" });
  }
});

// Health check route (for Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
