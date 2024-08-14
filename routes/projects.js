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
    date: req.body.date,
  });

  try {
    const newProject = await projects.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields
    project.name = req.body.name || project.name;
    project.date = req.body.date || project.date; // Add this line to handle the date field

    const updatedProject = await project.save();
    res.json(updatedProject);
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
