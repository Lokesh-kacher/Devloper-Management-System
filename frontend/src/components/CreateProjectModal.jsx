import React, { useState } from "react";
import ReactDOM from "react-dom";
import API from "../api/axios";

const CreateProjectModal = ({ fetchProjects, customTrigger }) => {
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProjects();
      setShow(false);
      setProjectData({ projectName: "", description: "" });
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const modalContent = show && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sidebar-bg/60 backdrop-blur-md"
        onClick={() => setShow(false)}
      ></div>

      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-[24px] w-full max-w-md shadow-2xl relative z-[10000] animate-in zoom-in-95 duration-200 border border-card-border"
      >
        <h2 className="text-3xl font-syne font-extrabold mb-1 text-gray-900 tracking-tight">New Project</h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">Create a new workspace for your repositories.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Project Name</label>
            <input
              type="text"
              name="projectName"
              placeholder="e.g., Ecommerce Platform"
              className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
              onChange={handleChange}
              value={projectData.projectName}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Briefly describe the project scope..."
              className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none h-32 transition-all font-medium text-gray-900 resize-none"
              onChange={handleChange}
              value={projectData.description}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-10">
          <button className="flex-1 bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
            Create Project
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="flex-1 bg-gray-50 text-gray-500 p-4 rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-95 border border-card-border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {customTrigger ? (
        React.cloneElement(customTrigger, { onClick: () => setShow(true) })
      ) : (
        <button
          onClick={() => setShow(true)}
          className="bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
        >
          + New Project
        </button>
      )}

      {show && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default CreateProjectModal;
