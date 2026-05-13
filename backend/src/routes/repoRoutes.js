const express = require("express");

const {
  createRepo,
  getRepos,
  updateEnvironment
} = require("../controllers/repoController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// create repository
router.post("/create", protect, createRepo);


// get repositories
router.get("/", protect, getRepos);


// update environment
router.put("/env/:id", protect, updateEnvironment);


module.exports = router;