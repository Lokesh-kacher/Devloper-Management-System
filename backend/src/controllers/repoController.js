const Repository = require("../models/Repository");
const Project = require("../models/Project");

// CREATE REPOSITORY
const createRepo = async (req, res) => {
  try {
    const { repoName, description, port, projectId } = req.body;

    // Check project permission
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { user: req.user.id },
        { collaborators: req.user.id }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: "Access Denied: You cannot create a repository in this project" });
    }

    // check duplicate port
    if (port) {
      const existingPort = await Repository.findOne({ port });
      if (existingPort) {
        return res.status(400).json({ message: "Port Already In Use" });
      }
    }

    // create repo
    const repo = await Repository.create({
      repoName,
      description,
      port,
      projectId
    });

    res.status(201).json({
      message: "Repository Created Successfully",
      repo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REPOSITORIES
const getRepos = async (req, res) => {
  try {
    // Find projects user has access to
    const userProjects = await Project.find({
      $or: [
        { user: req.user.id },
        { collaborators: req.user.id }
      ]
    });

    const projectIds = userProjects.map(p => p._id);

    const repos = await Repository.find({ projectId: { $in: projectIds } })
      .populate("projectId");

    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ENVIRONMENT
const updateEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const { environments } = req.body;

    const repo = await Repository.findById(id).populate("projectId");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check permissions
    const project = repo.projectId;
    if (project.user.toString() !== req.user.id && !project.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    repo.environments = environments;
    await repo.save();

    res.status(200).json({
      message: "Environment Updated",
      repo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REPOS BY PROJECT
const getReposByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check project permission
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { user: req.user.id },
        { collaborators: req.user.id }
      ]
    });

    if (!project) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const repos = await Repository.find({ projectId });
    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE REPO
const getRepoById = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id).populate("projectId");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check permission
    const project = repo.projectId;
    if (project.user.toString() !== req.user.id && !project.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.status(200).json(repo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PORT
const updatePort = async (req, res) => {
  try {
    const { port } = req.body;
    const { id } = req.params;

    const repo = await Repository.findById(id).populate("projectId");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check permission
    const project = repo.projectId;
    if (project.user.toString() !== req.user.id && !project.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    // 1. Validate if port is taken by ANOTHER repo
    const existingRepo = await Repository.findOne({ port, _id: { $ne: id } });
    if (existingRepo) {
      return res.status(400).json({ message: "Port is already in use by another repository" });
    }

    repo.port = port;
    await repo.save();
    
    res.status(200).json({ message: "Port updated successfully", repo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE REPOSITORY
const deleteRepo = async (req, res) => {
  try {
    const { id } = req.params;

    const repo = await Repository.findById(id).populate("projectId");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // Check permission (Only project owner can delete, or maybe collaborators too? Usually only owner)
    // For now, let's allow project owner AND collaborators who have access
    const project = repo.projectId;
    if (project.user.toString() !== req.user.id && !project.collaborators.includes(req.user.id)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    await Repository.findByIdAndDelete(id);

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRepo,
  getRepos,
  getReposByProject,
  getRepoById,
  updatePort,
  updateEnvironment,
  deleteRepo
};