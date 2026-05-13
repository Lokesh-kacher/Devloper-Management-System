const express = require("express");
const { createProject, getProjects, getProjectById } = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);

module.exports = router;