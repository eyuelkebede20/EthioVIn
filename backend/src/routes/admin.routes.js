const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createOrganizationAndAdmin, getAllOrganizations } = require("../controllers/superAdmin.controller");
const { createOfficer, getOfficers } = require("../controllers/subAdmin.controller");

const router = express.Router();

// Super Admin Organization Management
router.post("/organizations", protect, authorizeRoles("super_admin"), createOrganizationAndAdmin);
router.get("/organizations", protect, authorizeRoles("super_admin"), getAllOrganizations);

// Sub Admin Officer Management (Handles both Garage and Insurance)
router.post("/officers", protect, authorizeRoles("garage_admin", "insurance_admin"), createOfficer);
router.get("/officers", protect, authorizeRoles("garage_admin", "insurance_admin"), getOfficers);

module.exports = router;
