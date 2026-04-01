const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createOfficer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || !adminUser.organization) {
      return res.status(400).json({ error: "Admin organization not found." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const officerRole = adminUser.role === "garage_admin" ? "garage_officer" : "insurance_officer";

    const officer = await User.create({
      email,
      password: hashedPassword,
      role: officerRole,
      organization: adminUser.organization,
    });

    res.status(201).json({
      message: `${officerRole.replace("_", " ")} created successfully.`,
      officer: { email: officer.email, role: officer.role },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create officer." });
  }
};

const getOfficers = async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    const officerRole = adminUser.role === "garage_admin" ? "garage_officer" : "insurance_officer";

    const officers = await User.find({
      organization: adminUser.organization,
      role: officerRole,
    }).select("-password");

    res.json(officers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch officers." });
  }
};

module.exports = { createOfficer, getOfficers };
