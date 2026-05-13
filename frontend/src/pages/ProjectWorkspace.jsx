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

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Interactive */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">DEVPM</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3 w-full text-gray-500 hover:bg-gray-100 rounded-xl transition-all text-left"
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-3 p-3 w-full bg-blue-50 text-blue-600 rounded-xl transition-all text-left"
          >
            <span>📁</span>
            <span className="font-semibold">Workspace</span>
          </button>
          <button className="flex items-center space-x-3 p-3 w-full text-gray-500 hover:bg-gray-100 rounded-xl transition-all text-left">
            <span>⚙️</span>
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
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
             <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Projects</Link>
             <span>/</span>
             <span className="text-gray-600 font-medium">{project?.projectName}</span>
          </div>
          <div className="flex items-center space-x-3">
            <CollaboratorsModal 
              projectId={id} 
              collaborators={project?.collaborators} 
              fetchProject={fetchWorkspaceData} 
            />
            <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{project?.projectName}</h1>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">{project?.description || "No description provided for this project."}</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Module Repositories</h2>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <div className="text-5xl mb-4 text-gray-200">📦</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Workspace Empty</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Create your first repository module to start managing ports and environments.</p>
              <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo) => (
                <Link 
                  to={`/repository/${repo._id}`} 
                  key={repo._id}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <span className="text-2xl">📁</span>
                    </div>
                    <span className="text-gray-200 hover:text-gray-500 transition-colors">⋮</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{repo.repoName}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {repo.description || "Project module repository."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center text-xs text-gray-400 font-bold space-x-2">
                       <span className={`w-2 h-2 rounded-full ${repo.port ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                       <span>{repo.port ? `PORT: ${repo.port}` : 'UNCONFIGURED'}</span>
                    </div>
                    <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-sm">Configure →</span>
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

export default ProjectWorkspace;
