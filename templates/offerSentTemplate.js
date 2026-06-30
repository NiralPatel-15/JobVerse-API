const offerSentTemplate = ({
  candidateName,
  jobTitle,
  salary,
  joiningDate,
  message,
}) => {
  return `
    <h2>Congratulations! 🎉</h2>

    <p>Hello ${candidateName},</p>

    <p>You have received a job offer through JobVerse.</p>

    <ul>
      <li><strong>Position:</strong> ${jobTitle}</li>
      <li><strong>Salary:</strong> ${salary}</li>
      <li><strong>Joining Date:</strong> ${new Date(joiningDate).toLocaleDateString()}</li>
    </ul>

    ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}

    <p>Please login to JobVerse and review your offer.</p>

    <br>

    <p>Best Regards,<br/>JobVerse Team</p>
  `;
};

module.exports = offerSentTemplate;
