const { Worker } = require("bullmq");

const redisConnection = require("../../../config/redis");

const Application = require("../../../models/application");

const CandidateScore = require("../models/CandidateScore");

const Job = require("../../../models/Job");

const generateCandidateScore = require("../services/candidateScoringEngine.service");

const recalculateRankings = require("../services/ranking.service");

const worker = new Worker(
  "candidate-scoring",

  async (jobData) => {
    const { applicationId } = jobData.data;

    const application = await Application.findById(applicationId)
      .populate("user")
      .populate("job");

    if (!application) return;

    const parsedResume = {
      skills: [],
      totalExperience: application.experienceYears || 0,
    };

    const scoringResult = await generateCandidateScore({
      job: application.job,
      candidate: application.user,
      parsedResume,
    });

    await CandidateScore.findOneAndUpdate(
      {
        applicationId: application._id,
      },

      {
        applicationId: application._id,

        candidateId: application.user._id,

        recruiterId: application.job.createdBy,

        jobId: application.job._id,

        ...scoringResult,
      },

      {
        upsert: true,
        new: true,
      },
    );

    await recalculateRankings(application.job._id);

    console.log(`Candidate scored: ${applicationId}`);
  },

  {
    connection: redisConnection,
  },
);

module.exports = worker;
