const CandidateScore = require("../models/CandidateScore");

const Application = require("../models/Application");

const { scoreCandidate } = require("../services/ai/candidateScoringEngine");

exports.generateCandidateScore = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("candidate")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const resumeText = application.resumeText || "";

    const jobSkills = application.job?.skills || [];

    const experienceYears = application.candidate?.experienceYears || 0;

    const scoringResult = scoreCandidate({
      resumeText,
      jobSkills,
      experienceYears,
    });

    let candidateScore = await CandidateScore.findOne({
      application: application._id,
    });

    if (!candidateScore) {
      candidateScore = new CandidateScore({
        candidate: application.candidate._id,

        application: application._id,

        job: application.job._id,
      });
    }

    Object.assign(candidateScore, scoringResult);

    await candidateScore.save();

    // realtime socket emit
    if (req.io) {
      req.io.to(`job_${application.job._id}`).emit("candidateScoreUpdated", {
        applicationId: application._id,

        score: candidateScore.overallScore,

        recommendation: candidateScore.recommendation,
      });
    }

    res.json({
      success: true,
      candidateScore,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getCandidateScore = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const candidateScore = await CandidateScore.findOne({
      application: applicationId,
    });

    if (!candidateScore) {
      return res.status(404).json({
        message: "Candidate score not found",
      });
    }

    res.json({
      candidateScore,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};