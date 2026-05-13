const express = require("express");
const {
  createRepo,
  getRepos,
  getReposByProject,
  getRepoById,
  updatePort,
  updateEnvironment,
  deleteRepo
} = require("../controllers/repoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// create repository
router.post("/create", protect, createRepo);


// get repositories
router.get("/", protect, getRepos);

// get project repositories
router.get("/project/:projectId", protect, getReposByProject);

// get single repository
router.get("/:id", protect, getRepoById);

// update port
router.put("/port/:id", protect, updatePort);


// update environment
router.put("/env/:id", protect, updateEnvironment);

// delete repository
router.delete("/:id", protect, deleteRepo);

module.exports = router;