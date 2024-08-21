const express = require("express");
const router = express.Router();
const Attendance = require("../models/attendance");

// Get all attendance records with employee and project details
router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate({
        path: "employee",
        select: "firstName lastName", // Select only the fields you need
      })
      .populate({
        path: "project",
        select: "name", // Select only the fields you need
      })
      .exec();

    const formattedAttendance = attendanceRecords.map((record) => ({
      _id: record._id,
      employee: {
        _id: record.employee._id,
        name: `${record.employee.firstName} ${record.employee.lastName}`,
      },
      project: {
        _id: record.project._id,
        name: record.project.name,
      },
      startTime: record.startTime,
      endTime: record.endTime,
      totalHours: record.totalHours,
      type: record.type || "regular", // Default to 'regular' if type is undefined
    }));

    res.json(formattedAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new attendance record
router.post("/", async (req, res) => {
  const { employee, project, startTime, endTime, type } = req.body;
  try {
    const totalHours =
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    const newAttendance = new Attendance({
      employee,
      project,
      startTime,
      endTime,
      totalHours,
      type: type || "regular", // Default to 'regular' if type is not provided
    });
    const savedAttendance = await newAttendance.save();

    const populatedAttendance = await Attendance.findById(savedAttendance._id)
      .populate({
        path: "employee",
        select: "firstName lastName",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .exec();

    const formattedAttendance = {
      _id: populatedAttendance._id,
      employee: {
        _id: populatedAttendance.employee._id,
        name: `${populatedAttendance.employee.firstName} ${populatedAttendance.employee.lastName}`,
      },
      project: {
        _id: populatedAttendance.project._id,
        name: populatedAttendance.project.name,
      },
      startTime: populatedAttendance.startTime,
      endTime: populatedAttendance.endTime,
      totalHours: populatedAttendance.totalHours,
      type: populatedAttendance.type || "regular", // Default to 'regular' if type is undefined
    };

    res.status(201).json(formattedAttendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update an attendance record by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employee, project, startTime, endTime, type } = req.body;

  try {
    const updatedAttendance = await Attendance.findById(id);
    if (!updatedAttendance) {
      return res.status(404).json({ error: "Attendance record not found" });
    }
    const totalHours =
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    updatedAttendance.employee = employee;
    updatedAttendance.project = project;
    updatedAttendance.startTime = startTime;
    updatedAttendance.endTime = endTime;
    updatedAttendance.totalHours = totalHours;
    updatedAttendance.type = type || "regular"; // Default to 'regular' if type is not provided
    await updatedAttendance.save();

    const populatedAttendance = await Attendance.findById(updatedAttendance._id)
      .populate({
        path: "employee",
        select: "firstName lastName",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .exec();

    const formattedAttendance = {
      _id: populatedAttendance._id,
      employee: {
        _id: populatedAttendance.employee._id,
        name: `${populatedAttendance.employee.firstName} ${populatedAttendance.employee.lastName}`,
      },
      project: {
        _id: populatedAttendance.project._id,
        name: populatedAttendance.project.name,
      },
      startTime: populatedAttendance.startTime,
      endTime: populatedAttendance.endTime,
      totalHours: populatedAttendance.totalHours,
      type: populatedAttendance.type || "regular", // Default to 'regular' if type is undefined
    };

    res.json(formattedAttendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete an attendance record by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(id);
    if (!deletedAttendance)
      return res.status(404).json({ error: "Attendance record not found" });
    res.json(deletedAttendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
