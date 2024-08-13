const express = require("express");
const mongoose = require("mongoose");
const app = express();
const employeeRouter = require("./routes/employees");
const cors = require("cors");

app.use(express.json()); // Middleware to parse JSON
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your React app's origin
  })
);

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

app.use("/api/employees", employeeRouter);
