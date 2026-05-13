import React, { useEffect, useState } from "react";
import CreateProjectModal from "../components/CreateProjectModal";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Interactive */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">DEVPM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3 w-full bg-blue-50 text-blue-600 rounded-xl transition-all"
          >
            <span className="text-lg">🏠</span>
            <span className="font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3 w-full text-gray-500 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <span className="text-lg">📁</span>
            <span>Projects</span>
          </button>
          <button 
            className="flex items-center space-x-3 p-3 w-full text-gray-500 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <span className="text-lg">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="flex items-center space-x-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
          <div className="flex items-center space-x-6">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-100 border-2 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-0 outline-none w-72 transition-all"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm group-focus-within:text-blue-500 transition-colors">🔍</span>
             </div>
             <CreateProjectModal fetchProjects={fetchProjects} />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : "All Projects"}
              </h1>
              <p className="text-gray-500 mt-1">Manage and monitor your project workspaces</p>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-blue-600 font-medium hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-500">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">📂</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {searchQuery ? "No matching projects found" : "No projects yet"}
              </h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                {searchQuery ? "Try searching for a different keyword or name." : "Start by creating your first project workspace."}
              </p>
              {!searchQuery && <CreateProjectModal fetchProjects={fetchProjects} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link 
                  to={`/project/${project._id}`} 
                  key={project._id}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <span className="text-2xl font-bold">
                        {project.projectName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-gray-300 hover:text-gray-600 cursor-pointer p-1">⋮</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {project.description || "No project description provided."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400 font-bold space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>ACTIVE WORKSPACE</span>
                    </div>
                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">Open →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;