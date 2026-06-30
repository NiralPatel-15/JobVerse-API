const Tesseract = require("tesseract.js");

const runOCR = async (filePath) => {
  const result = await Tesseract.recognize(filePath, "eng", {
    logger: (m) => {
      console.log(m);
    },
  });

  return result.data.text;
};

module.exports = {
  runOCR,
};
