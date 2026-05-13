import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import CreateRepoModal from "../components/CreateRepoModal";
import CollaboratorsModal from "../components/CollaboratorsModal";

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaceData = async () => {
    try {
      const token = localStorage.getItem("token");
      const projectRes = await API.get(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(projectRes.data);
      const reposRes = await API.get(`/repos/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRepos(reposRes.data);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const handleDeleteRepo = async (e, repoId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this repository?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/repos/${repoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWorkspaceData();
    } catch (error) {
      console.error("Failed to delete repository:", error);
    }
  };

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar - Interactive */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 border-b border-gray-50">
          <h1 className="text-2xl font-black text-primary tracking-tighter">DEVPM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3.5 w-full text-gray-500 hover:bg-muted/50 hover:text-primary rounded-2xl transition-all text-left group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="font-semibold">Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3.5 w-full bg-accent/20 text-primary rounded-2xl transition-all text-left"
          >
            <span className="text-xl">📁</span>
            <span className="font-bold">Workspace</span>
          </button>
          <button className="flex items-center space-x-3 p-3.5 w-full text-gray-400 hover:bg-gray-50 rounded-2xl transition-all text-left">
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Settings</span>
          </button>
        </nav>
        <div className="p-6 border-t border-gray-50">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="flex items-center space-x-3 p-3.5 w-full text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all font-bold"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center space-x-3 text-xs font-bold tracking-widest uppercase">
             <Link to="/dashboard" className="text-gray-400 hover:text-primary transition-colors">Projects</Link>
             <span className="text-gray-200">/</span>
             <span className="text-primary">{project?.projectName}</span>
          </div>
          <div className="flex items-center space-x-4">
             {/* Modal trigger buttons */}
             <CollaboratorsModal 
              projectId={id} 
              collaborators={project?.collaborators} 
              fetchProject={fetchWorkspaceData} 
            />
            <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full">
          <div className="mb-14">
            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight leading-none">{project?.projectName}</h1>
            <p className="text-gray-500 text-xl max-w-3xl leading-relaxed font-medium">{project?.description || "A customized workspace for managing environment variables and repository port mappings."}</p>
          </div>

          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight flex items-center space-x-3">
              <span className="w-1.5 h-8 bg-accent rounded-full"></span>
              <span>Module Repositories</span>
            </h2>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-muted shadow-sm">
              <div className="text-7xl mb-6 grayscale opacity-20">📦</div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">Workspace Empty</h3>
              <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium leading-relaxed">Your project doesn't have any module repositories yet. Create one to start managing your configurations.</p>
              <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {repos.map((repo) => (
                <Link 
                  to={`/repository/${repo._id}`} 
                  key={repo._id}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl hover:border-accent hover:-translate-y-2 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-5 bg-muted/30 text-primary rounded-3xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                      <span className="text-3xl">📁</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={(e) => handleDeleteRepo(e, repo._id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Repository"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                      <span className="text-gray-200 group-hover:text-gray-400 transition-colors px-2 font-black text-xl">⋮</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-primary transition-colors tracking-tight">{repo.repoName}</h3>
                  <p className="text-gray-500 text-sm mb-10 line-clamp-2 leading-relaxed font-medium">
                    {repo.description || "Project module repository for managing environment configurations."}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center text-[10px] text-gray-400 font-black space-x-3 tracking-widest uppercase">
                       <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${repo.port ? 'bg-green-400' : 'bg-gray-200'}`}></span>
                       <span>{repo.port ? `PORT: ${repo.port}` : 'UNCONFIGURED'}</span>
                    </div>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-all font-black text-xs tracking-widest">OPEN WORKSPACE →</span>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150"></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectWorkspace;
