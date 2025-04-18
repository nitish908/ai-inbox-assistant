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

    if (response.data && response.data.choices && response.data.choices[0].message) {
      const summary = response.data.choices[0].message.content;
      res.json({ summary });
    } else {
      throw new Error("Unexpected response from AIML API");
    }
  } catch (error) {
    // Enhanced error handling with more specific info
    console.error("OpenAI error:", error.response?.data || error.message);

    if (error.response) {
      // Log detailed error response from the API
      console.error("Error response data:", error.response.data);
      res.status(500).json({
        error: "Something went wrong with the AI/ML API",
        details: error.response.data,
      });
    } else {
      // Log any other error (e.g., network error, etc.)
      res.status(500).json({
        error: "Something went wrong with the AI/ML API",
        details: error.message,
      });
    }
  }
});

// Health check route (for Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log("Your server is live 🎉"); // Confirmation message when the server is running
});
