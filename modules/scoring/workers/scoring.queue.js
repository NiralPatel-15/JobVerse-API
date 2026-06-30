const { Queue } = require("bullmq");

const redisConnection = require("../../../config/redis");

const scoringQueue = new Queue("candidate-scoring", {
  connection: redisConnection,
});

module.exports = scoringQueue;
