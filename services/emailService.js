const transporter = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"JobVerse" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};
