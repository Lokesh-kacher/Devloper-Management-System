const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
  {
    repoName: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    port: {
      type: Number
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    environments: {
      type: Map,
      of: String,
      default: {
        development: "",
        production: ""
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Repository", repositorySchema);