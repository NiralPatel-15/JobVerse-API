const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/ai-improve", async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const prompt = `Rewrite this ${type} into professional resume bullet points:\n${text}`;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
      },
    );

    console.log("AI RESPONSE:", response.data);

    const improvedText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || text;

    res.json({ result: improvedText });
  } catch (error) {
    console.error("🔥 FINAL ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI failed",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
