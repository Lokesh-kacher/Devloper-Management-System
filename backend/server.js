const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("../backend/src/config/db");

const authRoutes = require("../backend/src/routes/authRoutes");

const projectRoutes = require("../backend/src/routes/projectRoutes");

const repoRoutes = require("../backend/src/routes/repoRoutes");

const protect = require("../backend/src/middleware/authMiddleware");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());


// routes
app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/repos", repoRoutes);


// protected route
app.get("/api/profile", protect, (req, res) => {

  res.status(200).json({
    message: "Protected Route Accessed",
    user: req.user
  });
});


app.get("/", (req, res) => {
  res.send("Backend Running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});