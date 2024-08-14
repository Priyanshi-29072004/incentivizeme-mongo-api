const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Add this field
});

module.exports = mongoose.model("Project", projectSchema);
