const ModerationLog = require("../../models/ModerationLog");

exports.processModeration = async ({
  recruiterId,
  jobId,
  moderationResult,
}) => {
  const { toxicityScore, spamScore, aiScore, flagged, reason } =
    moderationResult;

  let action = "APPROVED";

  if (flagged) {
    action = "FLAGGED";
  }

  const log = await ModerationLog.create({
    recruiter: recruiterId,
    job: jobId,
    action,
    aiScore,
    toxicityScore,
    spamScore,
    reason,
  });

  return log;
};
