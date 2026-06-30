const Resume = require("../models/resumeModel");

// ===============================
// CREATE OR UPDATE RESUME
// ===============================
const saveResume = async (req, res) => {
  try {
    console.log("========== SAVE RESUME ==========");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const userId = req.user._id;
    const data = req.body;

    let resume = await Resume.findOne({ userId });

    if (resume) {
      resume = await Resume.findOneAndUpdate(
        { userId },
        { ...data },
        {
          new: true,
          runValidators: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Resume updated successfully",
        resume,
      });
    }

    resume = await Resume.create({
      ...data,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.log("========== ERROR ==========");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET MY RESUME
// ===============================
const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

module.exports = {
  saveResume,
  getMyResume,
};  
