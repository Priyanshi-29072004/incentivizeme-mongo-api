const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Payroll = require("../models/Payroll");

router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;

  // Input validation
  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({ message: "Invalid startDate format" });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({ message: "Invalid endDate format" });
  }

  try {
    const match = {};

    if (startDate && endDate) {
      match.payDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const payrollData = await Payroll.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "employees", // Name of the employees collection
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      { $unwind: "$employeeDetails" },
      {
        $group: {
          _id: "$employee",
          employeeDetails: { $first: "$employeeDetails" },
          totalHours: { $sum: "$totalHours" },
          totalBonus: { $sum: "$bonus" },
        },
      },
      {
        $project: {
          _id: 0,
          employee: {
            _id: "$employeeDetails._id",
            name: {
              $concat: [
                "$employeeDetails.firstName",
                " ",
                "$employeeDetails.lastName",
              ],
            },
          },
          totalHours: 1,
          bonus: "$totalBonus",
          basePay: {
            $multiply: ["$totalHours", "$employeeDetails.hourlyRate"],
          },
          grossPay: {
            $add: [
              {
                $multiply: ["$totalHours", "$employeeDetails.hourlyRate"],
              },
              "$totalBonus",
            ],
          },
        },
      },
    ]);

    if (payrollData.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll records found for the given date range" });
    }

    res.json(payrollData); // Return grouped records
  } catch (error) {
    console.error("Error fetching payroll report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
