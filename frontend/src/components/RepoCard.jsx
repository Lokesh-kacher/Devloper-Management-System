import React from "react";
import { useNavigate } from "react-router-dom";

const RepoCard = ({ repo }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/repository/${repo._id}`)}
      className="bg-white shadow-md p-5 rounded-xl cursor-pointer hover:shadow-xl transition"
    >
      <h2 className="text-2xl font-bold">
        {repo.repoName}
      </h2>

      <p className="text-gray-600 mt-2">
        {repo.description}
      </p>

      <div className="mt-4">
        <span className="bg-black text-white px-3 py-1 rounded">
          Open Repository
        </span>
      </div>
    </div>
  );
};

export default RepoCard;