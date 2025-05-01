// index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// ✅ New route for GET /
app.get("/", (req, res) => {
  res.send("Prompt Agent Server is Running ✅");
});

app.post("/generate-prompt", async (req, res) => {
  const userInput = req.body.romanUrdu;

  if (!userInput) {
    return res.status(400).json({ error: "Roman Urdu input is required." });
  }

  const promptForOpenRouter = `Convert the following idea written in Roman Urdu into a clear, professional English AI prompt:\n\n"${userInput}"`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful prompt engineer." },
          { role: "user", content: promptForOpenRouter },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const englishPrompt = response.data.choices[0].message.content;
    res.json({ prompt: englishPrompt });
  } catch (error) {
    console.error("OpenRouter API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate prompt." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
