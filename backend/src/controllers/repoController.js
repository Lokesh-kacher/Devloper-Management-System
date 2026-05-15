const Repository = require("../models/Repository");
const Project = require("../models/Project");
const { encrypt, decrypt } = require("../utils/encryption");

const decryptRepo = (repo) => {
  if (!repo) return null;
  const repoObj = repo.toObject ? repo.toObject() : repo;
  if (repoObj.environments) {
    // If it's a Map (from Mongoose), it might be an Object in toObject()
    // or still a Map depending on options.
    const environments = repoObj.environments;
    const decryptedEnvironments = {};
    
    // Handle both Map and Object
    const entries = environments instanceof Map ? environments.entries() : Object.entries(environments);
    
    for (const [key, value] of entries) {
      decryptedEnvironments[key] = decrypt(value);
    }
    repoObj.environments = decryptedEnvironments;
  }
  return repoObj;
};

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
      const portNum = Number(port);
      const existingPort = await Repository.findOne({ port: portNum });
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

    const decryptedRepos = repos.map(repo => decryptRepo(repo));

    res.status(200).json(decryptedRepos);
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

    // Encrypt each environment value before saving
    const encryptedEnvironments = {};
    for (const [key, value] of Object.entries(environments)) {
      encryptedEnvironments[key] = encrypt(value);
    }

    repo.environments = encryptedEnvironments;
    await repo.save();

    res.status(200).json({
      message: "Environment Updated",
      repo: decryptRepo(repo)
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
    const decryptedRepos = repos.map(repo => decryptRepo(repo));
    res.status(200).json(decryptedRepos);
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

    res.status(200).json(decryptRepo(repo));
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
    const portNum = Number(port);
    const existingRepo = await Repository.findOne({
      port: portNum,
      _id: { $ne: new (require("mongoose").Types.ObjectId)(id) }
    });
    if (existingRepo) {
      return res.status(400).json({ message: "Port is already in use by another repository" });
    }

    repo.port = portNum;
    await repo.save();
    
    res.status(200).json({ message: "Port updated successfully", repo: decryptRepo(repo) });
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