const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier"); // ✅ REQUIRED

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "jobverse_posts" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
