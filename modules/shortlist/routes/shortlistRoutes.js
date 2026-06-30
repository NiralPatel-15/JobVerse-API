const express = require("express");

const router = express.Router();

const auth = require("../../../middleware/auth");

const {
  getShortlistRecommendations,
} = require("../controllers/shortlistController");

router.get("/recommendations/:jobId", auth, getShortlistRecommendations);

module.exports = router;
