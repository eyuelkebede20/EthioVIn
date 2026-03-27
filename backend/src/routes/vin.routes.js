const express = require("express");
const { decodeVIN } = require("../controllers/vin.controller");

const router = express.Router();

router.post("/decode", decodeVIN);

module.exports = router;
