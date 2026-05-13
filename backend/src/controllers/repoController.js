const Repository = require("../models/Repository");


// CREATE REPOSITORY
const createRepo = async (req, res) => {

  try {

    const {
      repoName,
      description,
      port,
      projectId
    } = req.body;


    // check duplicate port
    if (port) {
      const existingPort = await Repository.findOne({ port });

      if (existingPort) {

        return res.status(400).json({
          message: "Port Already In Use"
        });
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

    res.status(500).json({
      message: error.message
    });
  }
};



// GET REPOSITORIES
const getRepos = async (req, res) => {

  try {

    const repos = await Repository.find()
      .populate("projectId");

    res.status(200).json(repos);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};



// UPDATE ENVIRONMENT
const updateEnvironment = async (req, res) => {

  try {

    const { id } = req.params;

    const { environments } = req.body;

    const repo = await Repository.findByIdAndUpdate(
      id,
      { environments },
      { new: true }
    );

    res.status(200).json({
      message: "Environment Updated",
      repo
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// GET REPOS BY PROJECT
const getReposByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const repos = await Repository.find({ projectId });
    res.status(200).json(repos);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET SINGLE REPO
const getRepoById = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repo);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE PORT
const updatePort = async (req, res) => {
  try {
    const { port } = req.body;
    const { id } = req.params;

    // 1. Validate if port is taken by ANOTHER repo
    const existingRepo = await Repository.findOne({ port, _id: { $ne: id } });
    if (existingRepo) {
      return res.status(400).json({ message: "Port is already in use by another repository" });
    }

    const repo = await Repository.findByIdAndUpdate(id, { port }, { new: true });
    res.status(200).json({ message: "Port updated successfully", repo });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createRepo,
  getRepos,
  getReposByProject,
  getRepoById,
  updatePort,
  updateEnvironment
};