const User = require("../models/user");

const extractMentions = async (text) => {
  try {
    const mentionRegex = /@(\w+)/g;

    const usernames = [];

    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      usernames.push(match[1]);
    }

    if (!usernames.length) {
      return [];
    }

    const users = await User.find({
      f_name: {
        $in: usernames,
      },
    }).select("_id");

    return users.map((u) => u._id);
  } catch (error) {
    console.log(error);

    return [];
  }
};

module.exports = extractMentions;
