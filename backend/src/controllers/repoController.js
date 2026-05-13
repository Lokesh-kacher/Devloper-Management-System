const Repository = require("../models/Repository");


// CREATE REPOSITORY
const createRepo = async (req, res) => {

  try {

    const {
      repoName,
      port,
      projectId
    } = req.body;


    // check duplicate port
    const existingPort = await Repository.findOne({ port });

    if (existingPort) {

      return res.status(400).json({
        message: "Port Already In Use"
      });
    }


    // create repo
    const repo = await Repository.create({
      repoName,
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


module.exports = {
  createRepo,
  getRepos,
  updateEnvironment
};