// routes/projects.js
const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Attendance = require("../models/attendance");
const Payroll = require("../models/Payroll");

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: "employees",
        select: "firstName lastName",
      })
      .exec();

    const formattedProjects = projects.map((project) => ({
      ...project.toObject(),
      employees: project.employees.map((employee) => ({
        _id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
      })),
    }));

    res.json(formattedProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new project
router.post("/", async (req, res) => {
  const {
    name,
    startDate,
    endDate,
    estimatedCompletionDate,
    employees,
    status,
    bonus,
  } = req.body;
  try {
    const newProject = new Project({
      name,
      startDate,
      endDate,
      estimatedCompletionDate, // Add this line
      employees,
      status,
      bonus,
    });
    const savedProject = await newProject.save();
    const populatedProject = await Project.findById(savedProject._id)
      .populate({
        path: "employees",
        select: "firstName lastName",
      })
      .exec();

    const formattedProject = {
      ...populatedProject.toObject(),
      employees: populatedProject.employees.map((employee) => ({
        _id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
      })),
    };

    res.status(201).json(formattedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a project by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    startDate,
    endDate,
    estimatedCompletionDate,
    employees,
    status,
    bonus,
  } = req.body;
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        name,
        startDate,
        endDate,
        estimatedCompletionDate,
        employees,
        status,
        bonus,
      }, // Add this line
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const populatedProject = await Project.findById(updatedProject._id)
      .populate({
        path: "employees",
        select: "firstName lastName",
      })
      .exec();

    const formattedProject = {
      ...populatedProject.toObject(),
      employees: populatedProject.employees.map((employee) => ({
        _id: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
      })),
    };

    res.json(formattedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a project by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject)
      return res.status(404).json({ error: "Project not found" });
    res.json(deletedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/mark-complete", async (req, res) => {
  const { projectIds } = req.body;

  if (!Array.isArray(projectIds) || projectIds.length === 0) {
    return res.status(400).json({ error: "No project IDs provided" });
  }

  try {
    const today = new Date();
    const projects = await Project.find({ _id: { $in: projectIds } }).populate(
      "employees"
    );

    if (!projects.length) {
      return res.status(404).json({ error: "No projects found" });
    }

    // Update projects with end date
    await Project.updateMany(
      { _id: { $in: projectIds } },
      { $set: { endDate: today, status: "completed" } }
    );

    // Process bonuses and create payroll records
    for (const project of projects) {
      if (project.endDate < project.estimatedCompletionDate) {
        const totalBonus = project.bonus || 0;
        const numEmployees = project.employees.length;
        const bonusPerEmployee = totalBonus / numEmployees;

        // Calculate total hours worked per employee for this project
        for (const employee of project.employees) {
          const attendanceRecords = await Attendance.find({
            project: project._id,
            employee: employee._id,
            endTime: { $exists: true }, // Ensure endTime exists
          });

          const totalHours = attendanceRecords.reduce((sum, record) => {
            return sum + (record.totalHours || 0); // Use the existing totalHours field
          }, 0);

          // Create payroll record
          await Payroll.create({
            employee: employee._id,
            project: project._id,
            totalHours,
            bonus: bonusPerEmployee,
            payDate: today,
          });
        }
      }
    }

    res
      .status(200)
      .json({ message: "Projects marked as complete and payroll processed" });
  } catch (error) {
    console.error("Error marking projects complete:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
