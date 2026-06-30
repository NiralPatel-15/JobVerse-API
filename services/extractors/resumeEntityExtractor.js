// ===============================
// EMAIL EXTRACTION
// ===============================

const extractEmail = (text) => {
  const match = text.match(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
  );

  return match?.[0] || null;
};

// ===============================
// PHONE EXTRACTION
// ===============================

const extractPhone = (text) => {
  const match = text.match(
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?[\d\-.\s]{7,15}/g,
  );

  return match?.[0] || null;
};

// ===============================
// SKILL EXTRACTION
// ===============================

const extractSkills = (text) => {
  const skillsDatabase = [
    "React",
    "Node.js",
    "MongoDB",
    "Express",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Docker",
    "AWS",
    "Redis",
    "Next.js",
    "Tailwind",
    "Socket.IO",
    "PostgreSQL",
    "MERN",
    "Git",
    "HTML",
    "CSS",
  ];

  return skillsDatabase.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase()),
  );
};

// ===============================
// EXPERIENCE EXTRACTION
// ===============================

const extractExperienceYears = (text) => {
  const match = text.match(/(\d+)\+?\s+years?/i);

  return match ? Number(match[1]) : 0;
};

// ===============================
// EDUCATION EXTRACTION
// ===============================

const extractEducation = (text) => {
  const educationKeywords = [
    "Bachelor",
    "Master",
    "B.Tech",
    "MCA",
    "BCA",
    "MBA",
    "PhD",
  ];

  return educationKeywords.filter((edu) =>
    text.toLowerCase().includes(edu.toLowerCase()),
  );
};

// ===============================
// MAIN ENTITY EXTRACTION
// ===============================

const extractResumeEntities = (text) => {
  return {
    email: extractEmail(text),

    phone: extractPhone(text),

    skills: extractSkills(text),

    experienceYears: extractExperienceYears(text),

    education: extractEducation(text),
  };
};

module.exports = {
  extractResumeEntities,
};
