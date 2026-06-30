const express = require("express");

const router = express.Router();

// ✅ CONTROLLERS
const {
  applyJob,
  getApplicants,
  updateStatus,
  getMyApplications,
  getApplicationDetails,
  getApplicationTimeline,
} = require("../controller/applicationController");

// ✅ AUTH
const auth = require("../middleware/auth");

// ✅ MULTER
const upload = require("../middleware/resumeUpload");

// ✅ APPLY JOB
router.post("/apply", auth, upload.single("resume"), applyJob);

// ✅ MY APPLICATIONS
router.get("/me", auth, getMyApplications);

// ✅ GET APPLICANTS
router.get("/job/:jobId", auth, getApplicants);

// ✅ UPDATE STATUS
router.put("/status/:id", auth, updateStatus);
router.get("/details/:id", auth, getApplicationDetails);
router.get("/timeline/:id", auth, getApplicationTimeline);

// ✅ ATS WORKSPACE APPLICATION
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("user", "f_name email profilePic");

    if (!application) {
      return res.status(404).json({
        msg: "Application not found",
      });
    }

    // ✅ SECURITY
    const isOwner =
      application.user._id.toString() ===
      req.user._id.toString();

    const isRecruiter =
      application.job.recruiter.toString() ===
      req.user._id.toString();

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }

    res.status(200).json(application);
  } catch (err) {
    console.log("GET APPLICATION ERROR:", err);

    res.status(500).json({
      msg: err.message,
    });
  }
});

module.exports = router; 