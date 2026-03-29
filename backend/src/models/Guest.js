const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true,
  },
  searchCount: {
    type: Number,
    default: 1,
  },
  lastSearch: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Guest", guestSchema);
