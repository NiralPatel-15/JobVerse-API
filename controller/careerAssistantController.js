const groq = require("../utils/groq");
const User = require("../models/user");
const Resume = require("../modules/resume/models/Resume");
const CandidateScore = require("../models/CandidateScore");
const Job = require("../models/job");
const reviewResumeService = require("../services/resumeReview.service");

const chatAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    // Resume Review
    if (message === "Resume Review") {
      const result = await reviewResumeService(req.user.id);

      return res.json({
        success: true,
        reply: result.review,
      });
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are JobVerse AI Career Assistant helping candidates with jobs, ATS optimization, resumes, interviews and career guidance. Always reply in markdown.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      success: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "AI Assistant Failed",
    });
  }
};

const recommendJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const resume = await Resume.findOne({
      candidate: userId,
    });

    const score = await CandidateScore.findOne({
      candidate: userId,
    }).sort({ createdAt: -1 });

    const jobs = await Job.find().select("title skills description").limit(10);

    const prompt = `
Candidate Skills:
${user.skills.join(", ")}

Resume Skills:
${resume?.parsedData?.skills?.map((s) => s.name).join(", ")}

ATS Score:
${score?.overallScore || 0}

Jobs:
${JSON.stringify(jobs)}

Recommend top jobs and explain why.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      recommendations: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};

const resumeReview = async (req, res) => {
  try {
    const { resumeText } = req.body;

    const prompt = `
Analyze this resume.

Provide:

1. Strengths
2. Weaknesses
3. Missing ATS keywords
4. Improvements
5. ATS score estimate

Resume:
${resumeText}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      review: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role } = req.body;

    const prompt = `
Generate:

10 Technical Questions
5 HR Questions
5 Behavioral Questions

For role:
${role}
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      questions: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};

const careerGuidance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    const prompt = `
Profile:

Headline:
${user.headline}

Skills:
${user.skills.join(",")}

About:
${user.about}

Give:

Career Roadmap
Skills to Learn
Projects to Build
Certifications
Job Roles
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      success: true,
      guidance: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
    });
  }
};

module.exports = {
  chatAssistant,
  recommendJobs,
  resumeReview,
  generateInterviewQuestions,
  careerGuidance,
};
