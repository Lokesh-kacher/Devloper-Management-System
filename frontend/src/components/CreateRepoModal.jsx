import React, { useState } from "react";
import ReactDOM from "react-dom";
import API from "../api/axios";

const CreateRepoModal = ({ fetchRepos, projectId, customTrigger }) => {
  const [show, setShow] = useState(false);

  const [repoData, setRepoData] = useState({
    repoName: "",
    description: "",
  });

  const handleChange = (e) => {
    setRepoData({
      ...repoData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...repoData,
        projectId: projectId
      };

      await API.post("/repos/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchRepos();
      setShow(false);
      setRepoData({ repoName: "", description: "" });
    } catch (error) {
      console.error("Error creating repository:", error);
    }
  };

  const modalContent = show && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-tnr">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sidebar-bg/60 backdrop-blur-md"
        onClick={() => setShow(false)}
      ></div>

      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-[32px] w-full max-w-[450px] shadow-2xl relative z-[10000] animate-in zoom-in-95 duration-200 border border-card-border"
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Module</h2>
          <p className="text-gray-500 font-medium mt-1">Add a new repository to your workspace.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Repository Name</label>
            <input
              type="text"
              name="repoName"
              placeholder="e.g. backend-api"
              className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
              onChange={handleChange}
              value={repoData.repoName}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
            <textarea
              name="description"
              placeholder="What is the purpose of this module?"
              className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none h-32 transition-all font-medium text-gray-900 resize-none"
              onChange={handleChange}
              value={repoData.description}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            type="submit"
            className="flex-1 bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            Create Repository
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="px-6 bg-gray-50 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-all"
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
        <div onClick={() => setShow(true)}>{customTrigger}</div>
      ) : (
        <button
          onClick={() => setShow(true)}
          className="flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="align-center-bottom">New Module</span>
        </button>
      )}

      {show && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default CreateRepoModal;