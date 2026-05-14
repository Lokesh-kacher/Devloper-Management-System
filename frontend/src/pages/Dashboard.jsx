import React, { useEffect, useState } from "react";
import CreateProjectModal from "../components/CreateProjectModal";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

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

  const handleDeleteProject = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this project? All associated repositories will also be deleted!")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/projects/delete/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const accents = ["#8C7355", "#9E8272", "#B5905A", "#7A8C72", "#A0826D", "#6B7280"];

  const topbarActions = (
    <>
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 bg-white border border-card-border rounded-full text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none w-64 transition-all"
        />
      </div>
      
      <CreateProjectModal fetchProjects={fetchProjects} customTrigger={
        <button className="flex items-center space-x-2 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Project</span>
        </button>
      } />
    </>
  );

  return (
    <MainLayout 
      title="Dashboard" 
      actions={topbarActions}
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Projects", value: projects.length, note: "+2 this month", color: "text-stone-600" },
          { label: "Active Nodes", value: "12", note: "All systems operational", color: "text-stone-500" },
          { label: "Resources", value: "84%", note: "Optimal usage", color: "text-stone-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[12px] border-[0.5px] border-card-border shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-[11px] font-medium text-gray-500 flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text', 'bg')}`}></span>
                <span>{stat.note}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {searchQuery ? `Results for "${searchQuery}"` : "My Projects"}
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            You have {filteredProjects.length} active projects in your workspace.
          </p>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-primary font-bold text-sm hover:underline underline-offset-4"
          >
            Clear search
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm animate-pulse">Initializing workspace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, i) => {
            const accent = accents[i % accents.length];
            return (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="group bg-white rounded-[14px] border-[0.5px] border-card-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      {project.projectName.charAt(0).toUpperCase()}
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteProject(e, project._id)}
                      className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 absolute top-4 right-4"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6 h-10">
                    {project.description || "No project description provided for this workspace."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-card-border/50">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }}></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                    </div>
                    <span className="text-primary font-bold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center">
                      Open <span className="ml-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Add Project Card */}
          <CreateProjectModal fetchProjects={fetchProjects} customTrigger={
            <button className="h-full min-h-[220px] bg-transparent border-2 border-dashed border-card-border rounded-[14px] flex flex-col items-center justify-center group hover:border-primary/50 hover:bg-white transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Create New Project</span>
            </button>
          } />
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;