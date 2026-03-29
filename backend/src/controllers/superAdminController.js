const User = require("../models/User");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");

const createOrganizationAndAdmin = async (req, res) => {
  const { orgName, orgType, adminEmail, adminPassword } = req.body;

  if (!["garage", "insurance"].includes(orgType)) {
    return res.status(400).json({ error: "Invalid organization type." });
  }

  try {
    // 1. Create the Organization
    const organization = await Organization.create({
      name: orgName,
      type: orgType,
    });

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 3. Create the Admin User for this Organization
    const adminRole = orgType === "garage" ? "garage_admin" : "insurance_admin";
    const adminUser = await User.create({
      email: adminEmail,
      password: hashedPassword,
      role: adminRole,
      organization: organization._id,
    });

    res.status(201).json({
      message: `${orgType} organization and admin created successfully.`,
      organization,
      admin: { email: adminUser.email, role: adminUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create organization and admin." });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch organizations." });
  }
};

module.exports = { createOrganizationAndAdmin, getAllOrganizations };
