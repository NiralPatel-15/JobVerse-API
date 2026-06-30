const offerRejectedTemplate = ({ candidateName, jobTitle }) => {
  return `
    <h2>Offer Rejected</h2>

    <p>Hello Recruiter,</p>

    <p>
      Candidate <strong>${candidateName}</strong>
      has rejected the offer for
      <strong>${jobTitle}</strong>.
    </p>

    <br>

    <p>JobVerse Team</p>
  `;
};

module.exports = offerRejectedTemplate;
