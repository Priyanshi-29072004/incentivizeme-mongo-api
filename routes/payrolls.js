const express = require("express");
const router = express.Router();
const Payroll = require("../models/Payroll");

router.get("/", async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPayroll = await Payroll.findByIdAndDelete(id);
    if (!deletedPayroll)
      return res.status(404).json({ error: "Payroll not found" });
    res.json(deletedPayroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
