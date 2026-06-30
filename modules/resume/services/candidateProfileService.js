const generateCandidateProfile = (parsedData) => {
  const totalExperienceYears =
    parsedData.experience?.reduce((acc, item) => {
      return acc + (item.years || 0);
    }, 0) || 0;

  const currentExperience = parsedData.experience?.[0] || {};

  return {
    totalExperienceYears,

    currentCompany: currentExperience.company || "",

    currentRole: currentExperience.role || "",

    highestEducation: parsedData.education?.[0]?.degree || "",

    topSkills:
      parsedData.skills
        ?.sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((s) => s.name) || [],
  };
};

module.exports = {
  generateCandidateProfile,
};
