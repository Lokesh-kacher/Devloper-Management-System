import React, { useState } from "react";
import API from "../api/axios";

const CreateRepoModal = ({ fetchRepos, projectId }) => {
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

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-sm"
      >
        + New Repository
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

          <form
            onSubmit={handleCreate}
            className="bg-white p-8 rounded-3xl w-[450px] shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Repository</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Repository Name</label>
                <input
                  type="text"
                  name="repoName"
                  placeholder="e.g. Frontend"
                  className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  onChange={handleChange}
                  value={repoData.repoName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe this module..."
                  className="w-full border border-gray-200 p-3.5 rounded-xl focus:ring-2 focus:ring-primary outline-none h-32 transition-all"
                  onChange={handleChange}
                  value={repoData.description}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 bg-primary text-white p-3.5 rounded-xl font-bold hover:opacity-90 transition-all">
                Create
              </button>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="flex-1 bg-gray-100 text-gray-700 p-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all"
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

export default CreateRepoModal;