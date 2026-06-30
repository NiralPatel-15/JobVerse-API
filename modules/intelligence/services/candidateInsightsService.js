const generateCandidateInsights = (application, job) => {
  const matchedSkills = [];
  const missingSkills = [];

  const strengths = [];
  const weaknesses = [];

  const resumeText = application.resumeText.toLowerCase();

  const requiredSkills = job.skills || [];

  requiredSkills.forEach((skill) => {
    if (resumeText.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // strengths
  if (matchedSkills.length >= 5) {
    strengths.push("Strong technical skill alignment");
  }

  if (application.experienceYears >= 3) {
    strengths.push("Good professional experience");
  }

  if (application.resumeQualityScore >= 70) {
    strengths.push("Well-structured resume");
  }

  // weaknesses
  if (missingSkills.length >= 3) {
    weaknesses.push("Missing several required skills");
  }

  if (application.experienceYears < 2) {
    weaknesses.push("Limited industry experience");
  }

  if (application.resumeQualityScore < 50) {
    weaknesses.push("Resume quality could be improved");
  }

  // ATS reasoning
  let atsReasoning = "";

  if (application.atsScore >= 85) {
    atsReasoning =
      "Excellent candidate match with strong skills alignment, quality resume, and relevant experience.";
  } else if (application.atsScore >= 70) {
    atsReasoning =
      "Good candidate profile with moderate alignment to job requirements.";
  } else if (application.atsScore >= 50) {
    atsReasoning = "Average candidate match. Recruiter review recommended.";
  } else {
    atsReasoning =
      "Low ATS compatibility due to missing skills or limited experience.";
  }

  return {
    matchedSkills,
    missingSkills,
    strengths,
    weaknesses,
    atsReasoning,
  };
};

module.exports = {
  generateCandidateInsights,
};
