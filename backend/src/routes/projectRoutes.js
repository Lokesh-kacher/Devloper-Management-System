const express = require("express");

const {
  createProject,
  getProjects,
  searchProjects
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// create project
router.post("/create", protect, createProject);


// get projects
router.get("/", protect, getProjects);


// search projects
router.get("/search", protect, searchProjects);


module.exports = router;