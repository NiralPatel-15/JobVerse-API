const RecruiterNote = require("../models/recruiterNote");

const createRecruiterNote = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const { content, mentions = [], parentNote = null } = req.body;

    const note = await RecruiterNote.create({
      application: applicationId,
      recruiter: req.recruiter._id,
      content,
      mentions,
      parentNote,
    });

    const populatedNote = await RecruiterNote.findById(note._id)
      .populate("recruiter", "name email profileImage")
      .populate("mentions", "name email")
      .populate("parentNote");

    // ✅ REALTIME UPDATE
    const io = req.app.get("io");

    io.to(`application:${applicationId}:notes`).emit(
      "recruiterNoteCreated",
      populatedNote,
    );

    res.status(201).json({
      success: true,
      note: populatedNote,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

const getRecruiterNotes = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const notes = await RecruiterNote.find({
      application: applicationId,
      deleted: false,
    })
      .populate("recruiter", "name email profileImage")
      .populate("mentions", "name email")
      .populate("parentNote")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false, 
      message: "Failed to fetch notes",
    });
  }
};

module.exports = {
  createRecruiterNote,
  getRecruiterNotes,
};
