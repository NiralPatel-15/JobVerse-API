const express = require("express");
const router = express.Router();

const sendEmail = require("../utils/sendEmail");

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "YOUR_EMAIL@gmail.com",
      "JobVerse Test Email",
      `
      <h2>JobVerse ATS</h2>
      <p>Email system is working successfully.</p>
      `,
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
