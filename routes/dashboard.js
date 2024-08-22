const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Payroll = require("../models/Payroll");

router.get("/", async (req, res) => {
  try {
    const totalOpenProjects = await Project.countDocuments({ endDate: null });
    const totalClosedProjects = await Project.countDocuments({
      endDate: { $ne: null },
    });

    const topEarners = await Payroll.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employee",
          foreignField: "_id",
          as: "employeeDetails",
        },
      },
      { $unwind: "$employeeDetails" },
      {
        $group: {
          _id: "$employee",
          name: {
            $first: {
              $concat: [
                "$employeeDetails.firstName",
                " ",
                "$employeeDetails.lastName",
              ],
            },
          },
          bonus: { $sum: "$bonus" },
        },
      },
      { $sort: { bonus: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      totalOpenProjects,
      totalClosedProjects,
      topEarners,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
