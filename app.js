const express = require("express");
const mongoose = require("mongoose");
const app = express();
const employeeRouter = require("./routes/employees");
const projectRouter = require("./routes/projects");
const attendanceRouter = require("./routes/attendances");
const payrollRouter = require("./routes/payrolls");
const reportRouter = require("./routes/report");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Use the routers
app.use("/api", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/projects", projectRouter);
app.use("/api/attendances", attendanceRouter);
app.use("/api/payrolls", payrollRouter);
app.use("/api/report", reportRouter);
app.use("/api/dashboard", dashboardRouter);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/employees", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
