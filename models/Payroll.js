const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
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
  totalHours: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  payDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payroll", payrollSchema);
