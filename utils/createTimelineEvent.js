const ApplicationTimeline = require("../models/applicationTimeline");

const createTimelineEvent = async ({
  applicationId,
  actor,
  type,
  title,
  description = "",
  metadata = {},
}) => {
  const event = await ApplicationTimeline.create({
    application: applicationId,
    actor,
    type,
    title,
    description,
    metadata,
  });

  return event;
};

module.exports = createTimelineEvent;
