const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Super Admin only
router.get("/super", protect, authorizeRoles("super_admin"), (req, res) => {
  res.json({ message: "Welcome to the Super Admin Dashboard data" });
});

// Insurance (Admin + Officer)
router.get("/insurance", protect, authorizeRoles("insurance_admin", "insurance_officer", "super_admin"), (req, res) => {
  res.json({ message: "Welcome to the Insurance Dashboard data" });
});

// Garage (Admin + Officer)
router.get("/garage", protect, authorizeRoles("garage_admin", "garage_officer", "super_admin"), (req, res) => {
  res.json({ message: "Welcome to the Garage Dashboard data" });
});

module.exports = router;
