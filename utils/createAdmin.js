const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      email: "admin@jobverse.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      email: "admin@jobverse.com",
      password: hashedPassword,
      role: "admin",
      f_name: "Super Admin",
    });

    await admin.save();

    console.log("✅ Admin Created");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

createAdmin();
