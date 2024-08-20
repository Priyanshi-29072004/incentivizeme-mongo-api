const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects with employee details
router.get("/", async (req, res) => {
  try {
    // Populate employee details and format the response
    const projects = await Project.find()
      .populate({
        path: "employees",
        select: "firstName lastName", // Select only the fields you need
      })
      .exec();

    // Format the response to include employee ID and name
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
  const { name, date, employees } = req.body;
  try {
    const newProject = new Project({ name, date, employees }); // Add employees to the project
    const savedProject = await newProject.save();
    const populatedProject = await Project.findById(savedProject._id)
      .populate({
        path: "employees",
        select: "firstName lastName", // Select only the fields you need
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
  const { name, date, employees } = req.body;
  console.log("Request to update project:", { id, name, date, employees });

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { name, date, employees },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      console.log("Project not found:", id);
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
    console.error("Error updating project:", err.message);
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

module.exports = router;
