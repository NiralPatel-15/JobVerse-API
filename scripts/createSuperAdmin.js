require("dotenv").config();

const mongoose = require("mongoose");

const User = require("../models/User");

const { ROLES } = require("../config/roles");

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({
      email: "superadmin@jobverse.com",
    });

    if (existing) {
      console.log("Super admin already exists");

      process.exit();
    }

    const admin = await User.create({
      name: "Super Admin",

      email: "superadmin@jobverse.com",

      password: "Admin@123",

      role: ROLES.SUPER_ADMIN,

      isApproved: true,
    });

    console.log("Super admin created");

    console.log(admin.email);

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

createSuperAdmin();
