const Resume = require("../models/Resume");

const recruiterResumeSearch = async (req, res) => {
  try {
    const { query, skills, experienceMin } = req.query;

    const filters = {
      parsingStatus: "COMPLETED",
    };

    if (query) {
      filters.$text = {
        $search: query,
      };
    }

    if (experienceMin) {
      filters["metadata.totalExperienceYears"] = {
        $gte: Number(experienceMin),
      };
    }

    if (skills) {
      filters["parsedData.skills.name"] = {
        $in: skills.split(","),
      };
    }

    const resumes = await Resume.find(filters)
      .sort({
        "aiInsights.overallScore": -1,
      })
      .limit(50);

    return res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Resume search failed",
    });
  }
};

module.exports = {
  recruiterResumeSearch,
};
