const calculateResumeQuality = (parsedResume) => {
  let score = 0;

  if (parsedResume.summary) {
    score += 15;
  }

  if (parsedResume.skills && parsedResume.skills.length >= 5) {
    score += 25;
  }

  if (parsedResume.experience && parsedResume.experience.length) {
    score += 25;
  }

  if (parsedResume.education && parsedResume.education.length) {
    score += 15;
  }

  if (parsedResume.projects && parsedResume.projects.length) {
    score += 10;
  }

  if (parsedResume.certifications && parsedResume.certifications.length) {
    score += 10;
  }

  return Math.min(score, 100);
};

module.exports = calculateResumeQuality;
