const interviewScheduledTemplate = ({
  candidateName,
  jobTitle,
  round,
  scheduledDate,
  duration,
  meetingLink,
  notes,
}) => {
  return `
    <h2>Interview Scheduled</h2>

    <p>Hello ${candidateName},</p>

    <p>Your interview has been scheduled.</p>

    <ul>
      <li><strong>Position:</strong> ${jobTitle}</li>
      <li><strong>Round:</strong> ${round}</li>
      <li><strong>Date:</strong> ${scheduledDate}</li>
      <li><strong>Duration:</strong> ${duration} Minutes</li>
    </ul>

    ${meetingLink ? `<p><a href="${meetingLink}">Join Interview</a></p>` : ""}

    ${notes ? `<p><strong>Instructions:</strong> ${notes}</p>` : ""}

    <br>

    <p>Best Regards,<br>JobVerse Team</p>
  `;
};

module.exports = interviewScheduledTemplate;
