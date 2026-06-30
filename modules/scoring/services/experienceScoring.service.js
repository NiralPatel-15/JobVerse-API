const calculateExperienceScore = (requiredYears = 0, candidateYears = 0) => {
  if (requiredYears <= 0) {
    return 100;
  }

  const ratio = candidateYears / requiredYears;

  return Math.min(Math.round(ratio * 100), 100);
};

module.exports = calculateExperienceScore;
