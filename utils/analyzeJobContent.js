const toxicWords = [
  "scam",
  "fraud",
  "hack",
  "cheat",
  "illegal",
  "adult",
  "casino",
  "betting",
  "crypto guaranteed",
];

const suspiciousPatterns = [
  "whatsapp",
  "telegram",
  "pay registration fee",
  "send money",
  "investment required",
];

const analyzeJobContent = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  let spamScore = 0;

  const detectedFlags = [];

  // =========================================
  // TOXIC WORDS
  // =========================================

  toxicWords.forEach((word) => {
    if (text.includes(word)) {
      spamScore += 15;

      detectedFlags.push(`Toxic keyword detected: ${word}`);
    }
  });

  // =========================================
  // SUSPICIOUS PATTERNS
  // =========================================

  suspiciousPatterns.forEach((pattern) => {
    if (text.includes(pattern)) {
      spamScore += 20;

      detectedFlags.push(`Suspicious pattern: ${pattern}`);
    }
  });

  // =========================================
  // URL DETECTION
  // =========================================

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const urls = text.match(urlRegex);

  if (urls && urls.length > 2) {
    spamScore += 25;

    detectedFlags.push("Too many external links detected");
  }

  // =========================================
  // FINAL CLASSIFICATION
  // =========================================

  let classification = "Safe";

  if (spamScore >= 60) {
    classification = "High Risk";
  } else if (spamScore >= 30) {
    classification = "Moderate Risk";
  }

  return {
    spamScore,
    classification,
    detectedFlags,
  };
};

module.exports = analyzeJobContent;
