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
    required: true,
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

// Pre-save middleware to calculate totalHours
attendanceSchema.pre("save", function (next) {
  if (this.isModified("startTime") || this.isModified("endTime")) {
    const start = new Date(this.startTime);
    const end = new Date(this.endTime);
    this.totalHours = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
