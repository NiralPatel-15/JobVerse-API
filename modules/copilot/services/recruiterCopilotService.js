const generateRecruiterCopilot = (application, job) => {
  const summaryParts = [];

  const strengths = [];

  const concerns = [];

  let recommendation = "Hold";

  let nextAction = "Manual recruiter review recommended.";

  // =========================
  // SKILL MATCHING
  // =========================

  const resumeText = application.resumeText?.toLowerCase() || "";

  const requiredSkills = job.skills || [];

  let matchedSkills = 0;

  requiredSkills.forEach((skill) => {
    if (resumeText.includes(skill.toLowerCase())) {
      matchedSkills++;
    }
  });

  // =========================
  // SUMMARY
  // =========================

  summaryParts.push(
    `Candidate has ${application.experienceYears} years of experience.`,
  );

  summaryParts.push(
    `Matched ${matchedSkills} out of ${requiredSkills.length} required skills.`,
  );

  // =========================
  // STRENGTHS
  // =========================

  if (application.skillsScore >= 80) {
    strengths.push("Strong technical skill alignment");
  }

  if (application.experienceScore >= 75) {
    strengths.push("Good professional experience");
  }

  if (application.resumeQualityScore >= 70) {
    strengths.push("High quality resume structure");
  }

  // =========================
  // CONCERNS
  // =========================

  if (application.skillsScore < 50) {
    concerns.push("Low required skill alignment");
  }

  if (application.experienceYears < 2) {
    concerns.push("Limited professional experience");
  }

  if (application.resumeQualityScore < 50) {
    concerns.push("Resume quality needs improvement");
  }

  // =========================
  // RECOMMENDATION
  // =========================

  if (application.atsScore >= 85) {
    recommendation = "Strong Hire";

    nextAction = "Proceed directly to technical interview round.";
  } else if (application.atsScore >= 70) {
    recommendation = "Hire";

    nextAction = "Recommended for recruiter screening.";
  } else if (application.atsScore >= 50) {
    recommendation = "Hold";

    nextAction = "Requires additional recruiter evaluation.";
  } else {
    recommendation = "Risk Candidate";

    nextAction = "Not recommended unless skill requirements are flexible.";
  }

  return {
    summary: summaryParts.join(" "),

    recommendation,

    nextAction,

    strengths,

    concerns,
  };
};

module.exports = {
  generateRecruiterCopilot,
};
