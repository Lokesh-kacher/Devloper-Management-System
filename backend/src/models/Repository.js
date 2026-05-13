const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema(
  {
    repoName: {
      type: String,
      required: true
    },

    port: {
      type: Number,
      required: true
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    environments: {

      development: {
        DB_URL: String,
        API_KEY: String
      },

      production: {
        DB_URL: String,
        API_KEY: String
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Repository", repositorySchema);