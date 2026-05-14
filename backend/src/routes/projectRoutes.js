const express = require("express");
const { createProject, getProjects, getProjectById, addCollaborator, removeCollaborator, deleteProject, updateProjectStatus } = require("../controllers/projectController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/:id/add-collaborator", protect, addCollaborator);
router.post("/:id/remove-collaborator", protect, removeCollaborator);
router.delete("/delete/:id", protect, deleteProject);
router.patch("/:id/status", protect, updateProjectStatus);

module.exports = router;