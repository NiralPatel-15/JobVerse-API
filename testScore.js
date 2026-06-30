const { scoreCandidate } = require("./services/ai/candidateScoringEngine");

const result = scoreCandidate({
  resumeText: "React Node MongoDB AWS Docker JavaScript Tailwind CSS Git",

  jobSkills: ["react", "node", "mongodb", "docker", "redis"],

  experienceYears: 3,
});

console.log(result);
