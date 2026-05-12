const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

    projectName: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {
    timestamps: true
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;