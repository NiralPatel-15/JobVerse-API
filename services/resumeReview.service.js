const fs = require("fs");
const groq = require("../utils/groq");

// Use ONLY ONE extractor
const { extractResumeText } = require("./resumeTextExtractor");

const reviewResume = async (file) => {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  try {
    console.log("===== Resume Review =====");
    console.log(file);

    // Extract resume text
    const resumeText = await extractResumeText(file);

    console.log("Resume extracted successfully");
    console.log(resumeText.substring(0, 200));

    if (!resumeText || resumeText.trim().length < 100) {
      throw new Error(
        "Unable to extract enough text from the uploaded resume.",
      );
    }

    const prompt = `
You are JobVerse Enterprise ATS Resume Reviewer.

Analyze the following resume exactly like an experienced recruiter.

Return ONLY Markdown.

# ATS Resume Review

## ATS Score

Estimate the ATS score out of 100.

## Executive Summary

Summarize the profile.

## Strengths

- Bullet points

## Weaknesses

- Bullet points

## Missing Keywords

- Bullet points

## Formatting Review

Evaluate formatting, readability and ATS compatibility.

## Recruiter Perspective

Would you shortlist this candidate?

## Final Recommendations

Provide actionable improvements.

## Estimated ATS Score After Improvements

Resume:

${resumeText}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            "You are an expert ATS Resume Reviewer. Reply ONLY in Markdown.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return {
      review: response.choices[0].message.content,
    };
  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

module.exports = reviewResume;
