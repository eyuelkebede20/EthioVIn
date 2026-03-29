const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["super_admin", "insurance_admin", "insurance_officer", "garage_admin", "garage_officer", "user"],
    default: "user",
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: null,
  },
  searchCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
