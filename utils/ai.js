const OpenAI = require("openai");

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = ai;
