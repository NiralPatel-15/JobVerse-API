const TECH_SKILLS = [
  "javascript",
  "react",
  "node",
  "express",
  "mongodb",
  "mysql",
  "python",
  "java",
  "c++",
  "aws",
  "docker",
  "kubernetes",
  "redis",
  "typescript",
  "tailwind",
  "nextjs",
  "html",
  "css",
  "git",
];

exports.extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  const foundSkills = TECH_SKILLS.filter((skill) =>
    lowerText.includes(skill.toLowerCase()),
  );

  return [...new Set(foundSkills)];
};
