const User = require("../../../models/user");

const extractMentions = async (message) => {
  try {
    const mentionMatches = message.match(/@([a-zA-Z0-9_]+)/g) || [];

    if (mentionMatches.length === 0) {
      return [];
    }

    const usernames = mentionMatches.map((mention) =>
      mention.replace("@", "").trim(),
    );

    const users = await User.find({
      f_name: {
        $in: usernames,
      },
      role: "recruiter",
    }).select("_id");

    return users.map((user) => user._id);
  } catch (error) {
    console.error("Mention Extraction Error:", error);

    return [];
  }
};

module.exports = extractMentions;
