const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all Project
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add an Project
router.post("/", async (req, res) => {
  const projects = new Project({
    name: req.body.name,
  });

  try {
    const newEmployee = await projects.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the employee's fields
    projects.name = req.body.name || projects.name;

    const updatedEmployee = await projects.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const projects = await Project.findById(req.params.id);
    if (!projects) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete the project
    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
