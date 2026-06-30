const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "Please use a valid email",
      ],
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },

    // ✅ ROLE (IMPORTANT)
    // =====================================
    // ROLE
    // =====================================
    role: {
      type: String,

      enum: ["user", "recruiter", "admin", "super_admin", "recruiter_manager"],

      default: "user",
    },

    permissions: [
      {
        type: String,
      },
    ],

    // =====================================
    // ACCOUNT STATUS
    // =====================================
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    // =====================================
    // RECRUITER APPROVAL STATUS
    // =====================================
    recruiterStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "recruiter" ? "pending" : null;
      },
    },

    f_name: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[A-Za-z ]+$/, "Name should contain only letters"],
    },

    headline: {
      type: String,
      default: "",
    },

    curr_company: {
      type: String,
      default: "",
    },

    curr_location: {
      type: String,
      default: "",
    },

    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&s",
    },

    cover_pic: {
      type: String,
      default: "https://pbs.twimg.com/media/Ek0QSuNWAAICxpX.png",
    },

    about: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: [
      {
        designation: { type: String, default: "" },
        company_name: { type: String, default: "" },
        duration: { type: String, default: "" },
        location: { type: String, default: "" },
      },
    ],

    // ✅ CONNECTION SYSTEM
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    sent_requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    received_requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ RESUME
    resume: {
      type: String,
    },

    // 🔥 OPTIONAL (VERY USEFUL)
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
      },
    ],

    companyWebsite: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },
  },

  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);