// models/Project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  estimatedCompletionDate: { type: Date },
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

projectSchema.pre("remove", async function (next) {
  try {
    await mongoose.model("Attendance").deleteMany({ project: this._id });
    await mongoose.model("Payroll").deleteMany({ project: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Project", projectSchema);
