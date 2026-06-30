const generateInterviewQuestions = (application, job) => {
  const technicalQuestions = [];

  const behavioralQuestions = [];

  const experienceQuestions = [];

  const weaknessQuestions = [];

  const resumeText = application.resumeText?.toLowerCase() || "";

  const requiredSkills = job.skills || [];

  // =========================
  // TECHNICAL QUESTIONS
  // =========================

  requiredSkills.forEach((skill) => {
    const lowerSkill = skill.toLowerCase();

    if (resumeText.includes(lowerSkill)) {
      technicalQuestions.push(`Explain your experience with ${skill}.`);

      technicalQuestions.push(
        `What are best practices when working with ${skill}?`,
      );

      technicalQuestions.push(`Describe a project where you used ${skill}.`);
    } else {
      weaknessQuestions.push(
        `You appear to have limited exposure to ${skill}. How would you learn and adapt quickly?`,
      );
    }
  });

  // =========================
  // EXPERIENCE QUESTIONS
  // =========================

  if (application.experienceYears >= 3) {
    experienceQuestions.push("Describe a scalable system you have built.");

    experienceQuestions.push(
      "Explain how you optimized backend or frontend performance in previous projects.",
    );

    experienceQuestions.push(
      "Tell us about a technical challenge you solved recently.",
    );
  } else {
    experienceQuestions.push(
      "Describe your strongest academic or personal project.",
    );

    experienceQuestions.push(
      "How do you approach learning new technologies quickly?",
    );
  }

  // =========================
  // BEHAVIORAL QUESTIONS
  // =========================

  behavioralQuestions.push(
    "Describe a difficult team collaboration situation and how you handled it.",
  );

  behavioralQuestions.push("How do you manage tight project deadlines?");

  behavioralQuestions.push(
    "Tell us about a time you handled constructive feedback.",
  );

  behavioralQuestions.push(
    "Describe a situation where you had to solve a problem independently.",
  );

  return {
    technicalQuestions,

    behavioralQuestions,

    experienceQuestions,

    weaknessQuestions,
  };
};

module.exports = {
  generateInterviewQuestions,
};
