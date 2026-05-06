const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/generate", async (req, res) => {
  try {
    const { topic, tone } = req.body;

    const prompt = `Write a LinkedIn post about "${topic}" in a ${tone} tone.
Use a strong hook, short paragraphs, and include 5 hashtags.`;

   const response = await client.chat.completions.create({
  model: "llama-3.1-8b-instant", // ✅ updated model
  messages: [
    { role: "user", content: prompt }
  ],
});

    const text = response.choices[0].message.content;

    res.json({ result: text });

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ result: "Error generating content" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});