import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateRepoModal from "../components/CreateRepoModal";
import RepoCard from "../components/RepoCard";
import API from "../api/axios";

const Dashboard = () => {
  const [repos, setRepos] = useState([]);

  const fetchRepos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/repos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRepos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-10">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">
            My Repositories
          </h1>

          <CreateRepoModal fetchRepos={fetchRepos} />

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {repos.map((repo) => (
            <RepoCard key={repo._id} repo={repo} />
          ))}

        </div>

      </div>
    </>
  );
};

export default Dashboard;