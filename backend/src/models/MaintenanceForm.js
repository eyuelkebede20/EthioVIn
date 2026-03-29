const mongoose = require("mongoose");

const maintenanceFormSchema = new mongoose.Schema({
  vin: {
    type: String,
    required: true,
    uppercase: true,
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  costETB: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MaintenanceForm", maintenanceFormSchema);
