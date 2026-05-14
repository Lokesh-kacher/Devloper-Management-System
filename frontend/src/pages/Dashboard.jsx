import React, { useEffect, useState } from "react";
import CreateProjectModal from "../components/CreateProjectModal";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // "card" | "list"
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const [projRes, repoRes] = await Promise.all([
        API.get("/projects", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/repos", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProjects(projRes.data);
      setRepos(repoRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const isPortSearch = /^\d+$/.test(searchQuery);

  const filteredProjects = projects.filter((project) => {
    if (isPortSearch) {
      return repos.some(repo =>
        repo.projectId?._id === project._id &&
        repo.port === parseInt(searchQuery)
      );
    }
    return project.projectName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isPortAvailable = isPortSearch && filteredProjects.length === 0;

  // Get repos for a given project
  const getProjectRepos = (projectId) =>
    repos.filter(r => r.projectId?._id === projectId || r.projectId === projectId);

  const STATUS_CYCLE = ["active", "underdevelopment", "completed"];

  const STATUS_CONFIG = {
    active:           { label: "Active",         dot: "bg-emerald-400", text: "text-emerald-600", bg: "bg-emerald-50" },
    underdevelopment: { label: "In Development", dot: "bg-amber-400",   text: "text-amber-600",   bg: "bg-amber-50"   },
    completed:        { label: "Completed",       dot: "bg-stone-400",   text: "text-stone-600",   bg: "bg-stone-100"  },
  };

  const handleStatusChange = async (e, projectId, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length];
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/projects/${projectId}/status`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(prev =>
        prev.map(p => p._id === projectId ? { ...p, status: nextStatus } : p)
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project? All associated repositories will also be deleted!")) return;
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
          placeholder="Search projects or ports..."
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
    <MainLayout title="Dashboard" actions={topbarActions}>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isPortSearch
              ? `Checking Port: ${searchQuery}`
              : searchQuery
                ? `Results for "${searchQuery}"`
                : "My Projects"}
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {isPortAvailable
              ? "This port is free for your next big module."
              : `You have ${filteredProjects.length} ${isPortSearch ? "project using this port" : "projects"} in your workspace.`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary font-bold text-sm hover:underline underline-offset-4 mr-2"
            >
              Clear search
            </button>
          )}
          {/* View toggle */}
          <div className="flex items-center bg-white border border-card-border rounded-lg p-1 space-x-1">
            <button
              onClick={() => setViewMode("card")}
              title="Card view"
              className={`p-1.5 rounded-md transition-all ${viewMode === "card" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List view"
              className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-gray-400 hover:text-gray-600"}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm animate-pulse">Initializing workspace...</p>
        </div>
      ) : isPortAvailable ? (
        <div className="flex flex-col items-center justify-center py-20 bg-emerald-50/30 rounded-[24px] border border-dashed border-emerald-200">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-2xl">⚓</div>
          <h2 className="text-2xl font-bold text-emerald-800 tracking-tight">Clear to use, captain</h2>
          <p className="text-emerald-600 mt-2 font-medium">Port {searchQuery} is currently unassigned in your workspace.</p>
        </div>
      ) : viewMode === "card" ? (
        /* ── CARD VIEW ── */
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
                    <button
                      onClick={(e) => handleStatusChange(e, project._id, project.status || "active")}
                      title="Click to change status"
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80 active:scale-95 ${STATUS_CONFIG[project.status || "active"].bg} ${STATUS_CONFIG[project.status || "active"].text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[project.status || "active"].dot}`}></span>
                      <span>{STATUS_CONFIG[project.status || "active"].label}</span>
                    </button>
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
      ) : (
        /* ── LIST VIEW ── */
        <div className="bg-white rounded-[14px] border border-card-border overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-card-border">
            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project</span>
            <span className="col-span-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
            <span className="col-span-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ports</span>
            <span className="col-span-1"></span>
          </div>

          {filteredProjects.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-400 font-medium text-sm">No projects found.</div>
          )}

          {filteredProjects.map((project, i) => {
            const accent = accents[i % accents.length];
            const projectRepos = getProjectRepos(project._id);
            const assignedPorts = projectRepos.filter(r => r.port).map(r => r.port);

            return (
              <Link
                to={`/project/${project._id}`}
                key={project._id}
                className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-card-border/50 last:border-b-0 hover:bg-gray-50/70 transition-all"
              >
                {/* Project name */}
                <div className="col-span-4 flex items-center space-x-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: `${accent}18`, color: accent }}
                  >
                    {project.projectName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate group-hover:text-primary transition-colors">
                      {project.projectName}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {project.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-3">
                  <button
                    onClick={(e) => handleStatusChange(e, project._id, project.status || "active")}
                    title="Click to change status"
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-80 active:scale-95 ${STATUS_CONFIG[project.status || "active"].bg} ${STATUS_CONFIG[project.status || "active"].text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[project.status || "active"].dot}`}></span>
                    <span>{STATUS_CONFIG[project.status || "active"].label}</span>
                  </button>
                </div>

                {/* Ports */}
                <div className="col-span-4 flex flex-wrap gap-1.5">
                  {assignedPorts.length > 0 ? assignedPorts.map(p => (
                    <span key={p} className="font-mono text-[11px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      :{p}
                    </span>
                  )) : (
                    <span className="text-[11px] text-gray-300 font-medium">No ports assigned</span>
                  )}
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex justify-end">
                  <span className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-sm">→</span>
                  <button
                    onClick={(e) => handleDeleteProject(e, project._id)}
                    className="ml-2 text-gray-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Link>
            );
          })}

          {/* Add project row */}
          <CreateProjectModal fetchProjects={fetchProjects} customTrigger={
            <button className="w-full grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-all group border-t border-dashed border-card-border">
              <div className="col-span-12 flex items-center space-x-3 text-gray-400 group-hover:text-primary transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-sm font-bold">Create New Project</span>
              </div>
            </button>
          } />
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;