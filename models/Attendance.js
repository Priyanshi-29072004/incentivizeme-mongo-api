const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  totalHours: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["regular", "bonus"], // Limit to these two options
    default: "regular", // Default value
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
