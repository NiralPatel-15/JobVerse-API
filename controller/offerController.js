const Offer = require("../models/offer");
const Application = require("../models/application");

const createNotification = require("../utils/createNotification");
const createTimelineEvent = require("../utils/createTimelineEvent");
const { sendEmail } = require("../services/emailService");
const offerSentTemplate = require("../templates/offerSentTemplate");
const offerAcceptedTemplate = require("../templates/offerAcceptedTemplate");
const offerRejectedTemplate = require("../templates/offerRejectedTemplate");

const socketManager = require("../socket");

// ======================================
// SEND OFFER
// ======================================

exports.sendOffer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { title, salary, joiningDate, message } = req.body;

    // Prevent duplicate pending offers
    const existingOffer = await Offer.findOne({
      application: applicationId,
      status: "pending",
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: "Offer already sent for this application",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("user");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (application.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const offer = await Offer.create({
      application: application._id,
      job: application.job._id,
      candidate: application.user._id,
      recruiter: req.user._id,
      title,
      salary,
      joiningDate,
      message,
    });

    application.status = "offer_sent";
    await application.save();

    await createTimelineEvent({
      applicationId: application._id,
      actor: req.user._id,
      type: "offer_sent",
      title: "Offer Sent",
      description: "Recruiter has sent an employment offer",
    });

    const notification = await createNotification({
      sender: req.user._id,
      receiver: application.user._id,
      type: "applicationStatus",
      title: "Job Offer Received",
      message: "Congratulations! You have received an offer.",
      action: "offer_sent",
      jobId: application.job._id,
      applicationId: application._id,
    });

    try {
      await sendEmail({
        to: application.user.email,

        subject: "Job Offer Received - JobVerse",

        html: offerSentTemplate({
          candidateName: application.user.f_name || "Candidate",

          jobTitle: application.job.title,

          salary,

          joiningDate,

          message,
        }),
      });

      console.log("Offer email sent");
    } catch (error) {
      console.error("Offer email failed:", error.message);
    }

    socketManager
      .getIO()
      .to(application.user._id.toString())
      .emit("newNotification", notification);

    res.status(201).json({
      success: true,
      message: "Offer sent successfully",
      offer,
    });
  } catch (err) {
    console.error("SEND OFFER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// MY OFFERS
// ======================================

exports.getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      candidate: req.user._id,
    })
      .populate("job")
      .populate("recruiter", "f_name email");

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// ACCEPT OFFER
// ======================================

// ======================================
// ACCEPT OFFER
// ======================================

exports.acceptOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("application")
      .populate("recruiter")
      .populate("candidate");

    if (!offer) {
      return res.status(404).json({
        msg: "Offer not found",
      });
    }

    // SECURITY CHECK
    if (offer.status !== "pending") {
      return res.status(400).json({
        msg: "Offer already processed",
      });
    }

    offer.status = "accepted";

    offer.respondedAt = new Date();

    await offer.save();

    const application = await Application.findById(offer.application._id);

    application.status = "hired";

    await application.save();

    // NOTIFY RECRUITER
    await createNotification({
      sender: req.user._id,

      receiver: offer.recruiter._id,

      type: "applicationStatus",

      title: "Offer Accepted",

      message: "Candidate accepted the offer.",

      action: "offer_accepted",

      jobId: offer.job,

      applicationId: application._id,
    });

    try {
      await sendEmail({
        to: offer.recruiter.email,

        subject: "Offer Accepted - JobVerse",

        html: offerAcceptedTemplate({
          candidateName: offer.candidate.f_name || "Candidate",

          jobTitle: offer.title,
        }),
      });

      console.log("Offer accepted email sent");
    } catch (error) {
      console.error("Offer accepted email failed:", error.message);
    }

    // TIMELINE EVENT
    await createTimelineEvent({
      applicationId: application._id,

      actor: req.user._id,

      type: "offer_accepted",

      title: "Offer Accepted",

      description: "Candidate accepted the offer",
    });

    // HIRED EVENT
    await createTimelineEvent({
      applicationId: application._id,

      actor: req.user._id,

      type: "hired",

      title: "Candidate Hired",

      description: "Candidate accepted the offer and joined the company",
    });

    res.status(200).json({
      success: true,
      msg: "Offer accepted successfully",
    });
  } catch (err) {
    console.log("ACCEPT OFFER ERROR:", err);

    res.status(500).json({
      msg: err.message,
    });
  }
};

// ======================================
// REJECT OFFER
// ======================================

exports.rejectOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("application")
      .populate("recruiter")
      .populate("candidate");

    if (offer.status !== "pending") {
      return res.status(400).json({
        msg: "Offer already processed",
      });
    }

    // SECURITY CHECK
    if (offer.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }

    offer.status = "rejected";

    offer.respondedAt = new Date();

    await offer.save();

    // NOTIFY RECRUITER
    await createNotification({
      sender: req.user._id,

      receiver: offer.recruiter._id,

      type: "applicationStatus",

      title: "Offer Rejected",

      message: "Candidate rejected the offer.",

      action: "offer_rejected",

      jobId: offer.job,

      applicationId: offer.application._id,
    });

    try {
      await sendEmail({
        to: offer.recruiter.email,

        subject: "Offer Rejected - JobVerse",

        html: offerRejectedTemplate({
          candidateName: offer.candidate.f_name || "Candidate",

          jobTitle: offer.title,
        }),
      });

      console.log("Offer rejected email sent");
    } catch (error) {
      console.error("Offer rejected email failed:", error.message);
    }

    // TIMELINE EVENT
    await createTimelineEvent({
      applicationId: offer.application._id,

      actor: req.user._id,

      type: "offer_rejected",

      title: "Offer Rejected",

      description: "Candidate rejected the offer",
    });

    res.status(200).json({
      success: true,
      msg: "Offer rejected successfully",
    });
  } catch (err) {
    console.log("REJECT OFFER ERROR:", err);

    res.status(500).json({
      msg: err.message,
    });
  }
};
