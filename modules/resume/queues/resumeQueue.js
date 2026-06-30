const { Queue } = require("bullmq");

const redisConnection = require("../../../config/redis");

const resumeQueue = new Queue("resume-processing", {
  connection: redisConnection,
});

module.exports = resumeQueue;
