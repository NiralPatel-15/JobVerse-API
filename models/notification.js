const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,

      enum: [
        "like",
        "comment",
        "message",
        "profile",
        "post",
        "connection",
        "request",

        // JOB PLATFORM
        "jobApplication",
        "applicationStatus",
        "jobApproved",
        "jobRejected",
        "jobReported",
        "recruiterApproved",
        "recruiterRejected",

        "offerSent",
        "offerAccepted",
        "offerRejected",

        "interviewScheduled",
        "interviewRescheduled",
        "interviewCancelled",
        "interviewCompleted",
      ],

      required: true,
    },
  
    title: {
      type: String,
    },

    message: {
      type: String,
    },

    action: {
      type: String,
    },

    redirectUrl: {
      type: String,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },

    metadata: {
      type: Object,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

NotificationSchema.index({ receiver: 1 });

NotificationSchema.index({
  receiver: 1,
  isRead: 1,
});

NotificationSchema.index({
  receiver: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Notification", NotificationSchema);