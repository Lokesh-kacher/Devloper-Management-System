import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const RepositoryPage = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold">
          Repository Page
        </h1>

        <p className="mt-4 text-gray-600">
          Repository ID: {id}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold">
              Port Repository
            </h2>

            <p className="mt-3 text-gray-600">
              Manage running ports here.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold">
              ENV Repository
            </h2>

            <p className="mt-3 text-gray-600">
              Store local & deployed env.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-xl">
            <h2 className="text-2xl font-bold">
              Deployment
            </h2>

            <p className="mt-3 text-gray-600">
              Manage deployment details.
            </p>
          </div>

        </div>

      </div>
    </>
  );
};

export default RepositoryPage;