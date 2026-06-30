const offerAcceptedTemplate = ({ candidateName, jobTitle }) => {
  return `
    <h2>Offer Accepted 🎉</h2>

    <p>Hello Recruiter,</p>

    <p>
      Candidate <strong>${candidateName}</strong>
      has accepted the offer for
      <strong>${jobTitle}</strong>.
    </p>

    <p>You may now proceed with onboarding.</p>

    <br>

    <p>JobVerse Team</p>
  `;
};

module.exports = offerAcceptedTemplate;
