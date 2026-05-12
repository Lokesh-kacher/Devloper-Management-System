import React, { useState } from "react";
import API from "../api/axios";

const CreateRepoModal = ({ fetchRepos }) => {
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

      await API.post("/repo/create", repoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Repository Created");

      fetchRepos();

      setShow(false);

      setRepoData({
        repoName: "",
        description: "",
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-black text-white px-5 py-3 rounded-xl"
      >
        + Create Repository
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <form
            onSubmit={handleCreate}
            className="bg-white p-8 rounded-xl w-[400px]"
          >
            <h2 className="text-3xl font-bold mb-6">
              Create Repository
            </h2>

            <input
              type="text"
              name="repoName"
              placeholder="Repository Name"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
              value={repoData.repoName}
            />

            <textarea
              name="description"
              placeholder="Description"
              className="w-full border p-3 rounded mb-4"
              onChange={handleChange}
              value={repoData.description}
            />

            <button className="bg-black text-white w-full p-3 rounded">
              Create
            </button>

            <button
              type="button"
              onClick={() => setShow(false)}
              className="bg-red-500 text-white w-full p-3 rounded mt-3"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateRepoModal;