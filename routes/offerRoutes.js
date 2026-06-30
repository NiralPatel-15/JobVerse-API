const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  sendOffer,
  getMyOffers,
  acceptOffer,
  rejectOffer,
} = require("../controller/offerController");

// ======================================
// RECRUITER
// ======================================

router.post("/send/:applicationId", auth, sendOffer);

// ======================================
// CANDIDATE
// ======================================

router.get("/my-offers", auth, getMyOffers);

router.put("/accept/:id", auth, acceptOffer);

router.put("/reject/:id", auth, rejectOffer);

module.exports = router;
