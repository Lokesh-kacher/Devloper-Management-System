import React, { useState } from "react";
import API from "../api/axios";

const CreateProjectModal = ({ fetchProjects }) => {
  const [show, setShow] = useState(false);
  const [projectData, setProjectData] = useState({
    projectName: "",
    description: "",
  });

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.post("/projects/create", projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProjects();
      setShow(false);
      setProjectData({ projectName: "", description: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all shadow-sm"
      >
        + New Project
      </button>

      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShow(false)}
          ></div>

          <form
            onSubmit={handleCreate}
            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">New Project</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  placeholder="e.g., Ecommerce Web App"
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  onChange={handleChange}
                  value={projectData.projectName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your project goals..."
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none h-32 transition-all"
                  onChange={handleChange}
                  value={projectData.description}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-primary text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all">
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 bg-gray-100 text-gray-700 p-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateProjectModal;
