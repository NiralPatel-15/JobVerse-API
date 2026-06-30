const welcomeEmailTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto;">
      <h2 style="color:#2563eb;">
        Welcome to JobVerse 🎉
      </h2>

      <p>Hello <b>${name}</b>,</p>

      <p>
        Your JobVerse account has been created successfully.
      </p>

      <p>You can now:</p>

      <ul>
        <li>Apply for jobs</li>
        <li>Track applications</li>
        <li>Attend interviews</li>
        <li>Receive job offers</li>
        <li>Build your professional network</li>
      </ul>

      <p>
        We're excited to be a part of your career journey.
      </p>

      <br/>

      <p>
        Best Regards,<br/>
        <b>Team JobVerse</b>
      </p>
    </div>
  `;
};

module.exports = welcomeEmailTemplate;
