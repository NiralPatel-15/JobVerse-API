import express from "express";
import upload from "../middlewares/upload.js";
import { uploadProfileImage } from "../controllers/uploadController.js";

const router = express.Router();

// single file upload
router.post("/profile", upload.single("image"), uploadProfileImage);

export default router;
