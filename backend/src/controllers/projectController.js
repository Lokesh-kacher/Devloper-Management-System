const Project = require("../models/Project");


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
      user: req.user.id
    });

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// SEARCH PROJECTS
const searchProjects = async (req, res) => {

  try {

    const search = req.query.search || "";

    const projects = await Project.find({
      user: req.user.id,

      projectName: {
        $regex: search,
        $options: "i"
      }
    });

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  createProject,
  getProjects,
  searchProjects
};