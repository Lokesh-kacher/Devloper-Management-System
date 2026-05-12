const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({

    repoName: {
        type: String,
        required: true
    },

    framework: {
        type: String
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

            PORT: String,

            DB_URL: String,

            API_URL: String,

            SECRET_KEY: String
        },

        production: {

            PORT: String,

            DB_URL: String,

            API_URL: String,

            SECRET_KEY: String
        }
    }

}, {
    timestamps: true
});

const Repository = mongoose.model("Repository", repositorySchema);

module.exports = Repository;