const applicationSubmittedTemplate = ({ candidateName, jobTitle }) => {
  return `
    <h2>Application Submitted Successfully 🚀</h2>

    <p>Hello ${candidateName},</p>

    <p>
      Your application for
      <strong>${jobTitle}</strong>
      has been submitted successfully.
    </p>

    <p>
      The recruiter will review your application and
      contact you if you are shortlisted.
    </p>

    <br>

    <p>Best Regards,<br/>JobVerse Team</p>
  `;
};

module.exports = applicationSubmittedTemplate;
