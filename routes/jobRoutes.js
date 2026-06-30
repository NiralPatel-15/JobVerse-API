const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/jobUpload");

const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  getRecruiterJobs,
} = require("../controller/jobController");

router.post("/create", auth, upload.single("image"), createJob);

router.get("/", getJobs);

router.get("/my-jobs", auth, getMyJobs);
router.get("/recruiter/:id", getRecruiterJobs);

router.get("/:id", getJobById);

module.exports = router;
