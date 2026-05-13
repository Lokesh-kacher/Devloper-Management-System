const Project = require("../models/Project");
const User = require("../models/User");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { projectName, description } = req.body;

    const project = await Project.create({
      projectName,
      description,
      user: req.user.id
    });

    res.status(201).json({
      message: "Project Created Successfully",
      project
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { user: req.user.id },
        { collaborators: req.user.id }
      ]
    }).populate("user", "name email");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE PROJECT
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user.id },
        { collaborators: req.user.id }
      ]
    }).populate("collaborators", "name email");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found or Access Denied" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ADD COLLABORATOR
const addCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const { id: projectId } = req.params;

    // Find the user to add
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Find the project and check if the current user is the owner
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return res.status(403).json({ message: "Only the project owner can add collaborators" });
    }

    // Check if user is already a collaborator or the owner
    if (project.collaborators.includes(userToAdd._id) || project.user.toString() === userToAdd._id.toString()) {
      return res.status(400).json({ message: "User is already a collaborator or owner" });
    }

    project.collaborators.push(userToAdd._id);
    await project.save();

    res.status(200).json({ message: "Collaborator added successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE COLLABORATOR
const removeCollaborator = async (req, res) => {
  try {
    const { collaboratorId } = req.body;
    const { id: projectId } = req.params;

    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return res.status(403).json({ message: "Only the project owner can remove collaborators" });
    }

    project.collaborators = project.collaborators.filter(
      (id) => id.toString() !== collaboratorId
    );
    await project.save();

    res.status(200).json({ message: "Collaborator removed successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Only owner can delete
    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found or Access Denied" });
    }

    // Also delete all repositories associated with this project
    const Repository = require("../models/Repository");
    await Repository.deleteMany({ projectId: id });

    res.status(200).json({ message: "Project and all its repositories deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addCollaborator,
  removeCollaborator,
  deleteProject
};