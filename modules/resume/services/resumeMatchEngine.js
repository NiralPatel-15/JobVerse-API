const calculateResumeMatch = ({
  candidateSkills = [],
  requiredSkills = [],
}) => {
  if (!requiredSkills.length) {
    return 0;
  }

  const normalizedCandidateSkills = candidateSkills.map((s) => s.toLowerCase());

  let matched = 0;

  requiredSkills.forEach((skill) => {
    if (normalizedCandidateSkills.includes(skill.toLowerCase())) {
      matched++;
    }
  });

  const percentage = (matched / requiredSkills.length) * 100;

  return Math.round(percentage);
};

module.exports = {
  calculateResumeMatch,
};
