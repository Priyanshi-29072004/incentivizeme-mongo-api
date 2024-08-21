const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  hourlyRate: { type: Number, default: 0 },
  dateOfJoining: { type: Date },
  birthDate: { type: Date }, // Add this line
});

module.exports = mongoose.model("Employee", employeeSchema);
