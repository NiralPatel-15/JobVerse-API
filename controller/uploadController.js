import imagekit from "../config/imagekit.js";

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    const response = await imagekit.upload({
      file: file.buffer, // 🔥 buffer from multer
      fileName: file.originalname,
      folder: "/resume-profiles",
    });

    res.status(200).json({
      url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
