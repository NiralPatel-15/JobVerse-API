const groq = require("../utils/groq");
const User = require("../models/user");
const Job = require("../models/job");
const CandidateScore = require("../models/CandidateScore");
const reviewResumeService = require("../services/resumeReview.service");

const improveText = async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    let prompt = `Improve this resume content professionally:\n${text}`;

    if (type === "summary") {
      prompt = `
Rewrite this professional summary.

RULES:
- Keep it short (2-3 lines)
- Simple and professional
- No extra explanation

Content:
${text}
`;
    } else if (type === "experience") {
      prompt = `
Rewrite this experience for a resume.

RULES:
- Maximum 4 lines
- Each line must be ONE short sentence
- No bullet points
- No headings
- No extra explanation
- Keep it simple and professional

Content:
${text}
`;
    } else if (type === "skills") {
      prompt = `
Convert this into professional resume skills.

RULES:
- Only skill names
- No sentences
- No explanation
- Maximum 10 skills
- Comma separated

Content:
${text}
`;
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are JobVerse AI Career Copilot.

RULES:

- Always respond in Markdown.
- Use headings (#, ##).
- Use bullet points.
- Use numbered lists when needed.
- Keep answers professional.
- Never return plain text paragraphs.
- Format responses like an enterprise ATS assistant.

Example:

# Resume Review

## Strengths

- React
- Node.js

## Improvements

- Add measurable achievements
- Add ATS keywords

## Final Recommendation

Your resume is good but needs ATS optimization.
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      improvedText: response.choices[0].message.content,
    });
  } catch (error) {
    console.log("GROQ ERROR:", error);

    res.status(500).json({
      message: "AI failed",
    });
  }
};

const recommendJobs = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    const latestScore = await CandidateScore.findOne({
      candidate: userId,
    }).sort({ createdAt: -1 });

    let candidateSkills = [...(user.skills || [])];

    if (latestScore?.extractedSkills?.length) {
      candidateSkills = [
        ...new Set([...candidateSkills, ...latestScore.extractedSkills]),
      ];
    }

    const jobs = await Job.find({
      status: "approved",
    });

    const recommendations = jobs.map((job) => {
      const jobSkills = job.skills || [];

      const matchedSkills = candidateSkills.filter((skill) =>
        jobSkills.some(
          (j) => j.toLowerCase().trim() === skill.toLowerCase().trim(),
        ),
      );

      const matchScore =
        jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

      return {
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        workMode: job.workMode,
        matchScore,
        matchedSkills,
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      recommendations: recommendations.slice(0, 10),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to recommend jobs",
    });
  }
};

const reviewResume = async (req, res) => {
  try {
    console.log("===== Resume Review =====");
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    const result = await reviewResumeService(req.file);

    res.json({
      success: true,
      review: result.review,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  improveText,
  recommendJobs,
  reviewResume,
};
