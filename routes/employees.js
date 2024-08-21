const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");

// Create a new employee
router.post("/", async (req, res) => {
  const { firstName, lastName, hourlyRate, dateOfJoining, birthDate } =
    req.body;
  try {
    const employee = new Employee({
      firstName,
      lastName,
      hourlyRate,
      dateOfJoining,
      birthDate, // Add this line
    });
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an employee
router.put("/:id", async (req, res) => {
  const { firstName, lastName, hourlyRate, dateOfJoining, birthDate } =
    req.body;
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, hourlyRate, dateOfJoining, birthDate }, // Add this line
      { new: true }
    );
    if (updatedEmployee) {
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee
router.delete("/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (deletedEmployee) {
      res.json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
