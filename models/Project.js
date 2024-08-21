// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  estimatedCompletionDate: { type: Date }, // Add this line
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  ],
  status: {
    type: String,
    enum: ["pending", "open", "closed"],
    default: "pending",
  },
  bonus: { type: Number, default: 0 }, // Added bonus field
});

module.exports = mongoose.model("Project", projectSchema);
