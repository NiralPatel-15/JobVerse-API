const calculateSkillsScore = (requiredSkills = [], candidateSkills = []) => {
  if (!requiredSkills.length) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase().trim());

  const normalizedCandidate = candidateSkills.map((s) =>
    s.toLowerCase().trim(),
  );

  const matchedSkills = normalizedRequired.filter((skill) =>
    normalizedCandidate.includes(skill),
  );

  const missingSkills = normalizedRequired.filter(
    (skill) => !normalizedCandidate.includes(skill),
  );

  const score = Math.round(
    (matchedSkills.length / normalizedRequired.length) * 100,
  );

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

module.exports = calculateSkillsScore;
