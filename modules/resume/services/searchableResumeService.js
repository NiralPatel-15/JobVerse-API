const buildSearchableText = (parsedData) => {
  const skills = parsedData.skills?.map((s) => s.name).join(" ") || "";

  const experience =
    parsedData.experience
      ?.map((e) => {
        return `${e.company} ${e.role} ${e.description}`;
      })
      .join(" ") || "";

  const education =
    parsedData.education
      ?.map((e) => {
        return `${e.institution} ${e.degree}`;
      })
      .join(" ") || "";

  return `
    ${parsedData.summary || ""}
    ${skills}
    ${experience}
    ${education}
  `;
};

module.exports = {
  buildSearchableText,
};
