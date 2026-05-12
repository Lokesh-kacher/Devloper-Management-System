import React from "react";

const Navbar = () => {
  return (
    <div className="bg-black text-white p-4 flex justify-between">
      <h1 className="text-2xl font-bold">Repo Manager</h1>

      <div>
        <button className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;