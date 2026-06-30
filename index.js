const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");

require("./modules/scoring/workers/scoring.worker");

const UserRoutes = require("./routes/user");
const PostRoutes = require("./routes/post");
const NotificationRoutes = require("./routes/notification");
const CommentRoutes = require("./routes/comment");
const ConversationRoutes = require("./routes/conversation");
const MessageRoutes = require("./routes/message");
const aiRouter = require("./routes/aiRoutes");
const UploadRoutes = require("./server/routes/uploadRoutes");

const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const recruiterNotesSocket = require("./socket/recruiterNotesSocket");

const recruiterNoteRoutes = require("./routes/recruiterNoteRoutes");
const applicationDiscussionRoutes = require("./routes/applicationDiscussionRoutes");

const interviewRoutes = require("./routes/interviewRoutes");
const scorecardRoutes = require("./routes/scorecardRoutes");
const interviewPanelRoutes = require("./routes/interviewPanelRoutes");
const interviewScheduleRoutes = require("./routes/interviewScheduleRoutes");
const offerRoutes = require("./routes/offerRoutes");

// ENTERPRISE RESUME PARSER
const resumeBuilderRoutes = require("./routes/resumeRoutes");
const resumeRoutes = require("./modules/resume/routes/resumeRoutes");
const scoringRoutes = require("./modules/scoring/routes/scoring.routes");
const candidateInsightsRoutes = require("./modules/intelligence/routes/candidateInsightsRoutes");
const recruiterCopilotRoutes = require("./modules/copilot/routes/recruiterCopilotRoutes");
const interviewQuestionRoutes = require("./modules/interviewCopilot/routes/interviewQuestionRoutes");
const pipelineAutomationRoutes = require("./modules/automation/routes/pipelineAutomationRoutes");
const shortlistRoutes = require("./modules/shortlist/routes/shortlistRoutes");
const registerShortlistSocket = require("./modules/shortlist/socket/shortlistSocket");
const priorityQueueRoutes = require("./modules/shortlist/routes/priorityQueueRoutes");
const talentMatchRoutes = require("./modules/talentMatch/routes/talentMatchRoutes");
const communicationRoutes = require("./modules/communication/routes/communicationRoutes");
const notificationRoutes = require("./modules/communication/routes/notificationRoutes");
const channelRoutes = require("./modules/collaboration/routes/channelRoutes");
const channelMessageRoutes = require("./modules/collaboration/routes/channelMessageRoutes");
const registerChannelSocket = require("./modules/collaboration/sockets/channelSocket");
const channelInvitationRoutes = require("./modules/collaboration/routes/channelInvitationRoutes");
const emailRoutes = require("./routes/emailRoutes");
const careerAssistantRoutes = require("./routes/careerAssistantRoutes");

const http = require("http");

const socketManager = require("./socket");

const app = express();

const server = http.createServer(app);





const PORT = process.env.PORT || 4000;

// ===============================
// SOCKET INIT
// ===============================

const io = socketManager.init(server);
registerShortlistSocket(io);


// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// ===============================
// STORE ONLINE USERS
// ===============================

let users = [];

const addUser = (userId, socketId) => {
  users = users.filter((u) => u.userId !== userId);

  users.push({
    userId,
    socketId,
  });
};

const removeUser = (socketId) => {
  users = users.filter((u) => u.socketId !== socketId);
};

// ===============================
// SOCKET CONNECTION
// ===============================
let onlineUsers = [];

io.on("connection", (socket) => {
  recruiterNotesSocket(io, socket);
  registerChannelSocket(io, socket);
 
  
  // console.log("User Connected:", socket.id);

  // ============================
  // ADD USER
  // ============================

  socket.on("addUser", (userId) => {
    socket.join(userId);

    addUser(userId, socket.id);

    io.emit("getUsers", users);

    // console.log("User Joined:", userId);
  });

  // ============================
  // ADMIN ROOM
  // ============================

  socket.on("joinAdmin", () => {
    socket.join("admin-room");

    console.log("Admin Joined");
  });

  // ============================
  // JOIN CONVERSATION
  // ============================

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // ============================
  // TYPING
  // ============================

  socket.on("typing", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("typing", {
      senderId,
    });
  });

  // ============================
  // STOP TYPING
  // ============================

  socket.on("stopTyping", ({ conversationId, senderId }) => {
    socket.to(conversationId).emit("stopTyping", {
      senderId,
    });
  });

  // ============================
  // SEND MESSAGE
  // ============================

  socket.on("sendMessage", ({ sender, receiverId, text }) => {
    io.to(receiverId).emit("getMessage", {
      sender,

      text,

      createdAt: Date.now(),
    });
  });

  // ============================
  // SEND NOTIFICATION
  // ============================

  socket.on("sendNotification", (data) => {
    io.to(data.receiverId).emit("newNotification", data);
  });

  // ============================
  // ADMIN NOTIFICATION
  // ============================

  socket.on("adminNotification", (data) => {
    io.to("admin-room").emit("adminNotification", data);
  });

  // ============================
  // DISCONNECT
  // ============================

  socket.on("disconnect", () => {

    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);

    io.emit(
      "online-users",
      onlineUsers.map((u) => u.userId),
    );
    console.log("Disconnected:", socket.id);

    removeUser(socket.id);

    io.emit("getUsers", users);
  });

  socket.on("joinApplicationRoom", (applicationId) => {
    socket.join(`application_${applicationId}`);
  });

  socket.on("leaveApplicationRoom", (applicationId) => {
    socket.leave(`application_${applicationId}`);
  });

  socket.on("joinAdminModeration", () => {
    socket.join("admin_moderation");
  });

  socket.on("join-user", (userId) => {
    onlineUsers = onlineUsers.filter((u) => u.userId !== userId);

    onlineUsers.push({
      userId,
      socketId: socket.id,
    });

    io.emit(
      "online-users",
      onlineUsers.map((u) => u.userId),
    );
  });

  socket.on("messages-seen", (data) => {
    io.to(data.conversationId).emit("messages-seen-updated", {
      conversationId: data.conversationId,
      userId: data.userId,
    });
  });
});

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("io", io);
// ===============================
// ROUTES
// ===============================
app.use("/api/auth", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/comment", CommentRoutes);
app.use("/api/conversation", ConversationRoutes);
app.use("/api/message", MessageRoutes);
app.use("/api/user", UserRoutes);

app.use("/api/resume", resumeRoutes);

app.use("/api/ai", aiRouter);
app.use("/api/upload", UploadRoutes);

app.use("/api/applications", applicationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use("/api/recruiter-notes", recruiterNoteRoutes);

app.use("/api/application-discussions", applicationDiscussionRoutes);

app.use("/api/interviews", interviewRoutes);

app.use("/api/scorecards", scorecardRoutes);

app.use("/api/interview-panels", interviewPanelRoutes);

app.use("/api/interview-schedules", interviewScheduleRoutes);

app.use("/api/moderation", require("./routes/moderationRoutes"));
app.use("/api/scoring", scoringRoutes);
app.use("/api/intelligence", candidateInsightsRoutes);
app.use("/api/copilot", recruiterCopilotRoutes);
app.use("/api/interview-copilot", interviewQuestionRoutes);
app.use("/api/automation", pipelineAutomationRoutes);
app.use("/api/shortlist", shortlistRoutes);
app.use("/api/priority-queue", priorityQueueRoutes);
app.use("/api/talent-match", talentMatchRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/channel-messages", channelMessageRoutes);
app.use("/api/channel-invitations", channelInvitationRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/ai", careerAssistantRoutes);
app.use("/api/resume-builder", resumeBuilderRoutes);

// ===============================
// DB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error:", err.message);
  });