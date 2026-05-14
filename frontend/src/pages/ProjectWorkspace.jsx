import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import CreateRepoModal from "../components/CreateRepoModal";
import CollaboratorsModal from "../components/CollaboratorsModal";
import MainLayout from "../components/MainLayout";

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

  const accents = ["#8C7355", "#9E8272", "#B5905A", "#7A8C72", "#A0826D", "#6B7280"];

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-main-bg">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const topbarActions = (
    <div className="flex items-center space-x-3">
      <CollaboratorsModal 
        projectId={id} 
        collaborators={project?.collaborators} 
        fetchProject={fetchWorkspaceData} 
      />
      <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
    </div>
  );

  const breadcrumbs = [
    { label: "Projects", link: "/dashboard" },
    { label: project?.projectName || "Workspace" }
  ];

  return (
    <MainLayout 
      title={project?.projectName || "Workspace"} 
      breadcrumbs={breadcrumbs}
      actions={topbarActions}
    >
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          {project?.projectName}
        </h1>
        <p className="text-gray-500 text-lg max-w-3xl leading-relaxed font-medium">
          {project?.description || "A customized workspace for managing environment variables and repository port mappings."}
        </p>
      </div>

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-card-border/50">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center space-x-3">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          <span>Module Repositories</span>
        </h2>
      </div>

      {repos.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[24px] border-2 border-dashed border-card-border shadow-sm">
          <div className="text-5xl mb-6 opacity-20">📦</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Workspace Empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium leading-relaxed">
            Your project doesn't have any module repositories yet. Create one to start managing your configurations.
          </p>
          <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo, i) => {
            const accent = accents[i % accents.length];
            return (
              <Link 
                to={`/repository/${repo._id}`} 
                key={repo._id}
                className="group bg-white rounded-[14px] border-[0.5px] border-card-border overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    
                    <button 
                      onClick={(e) => handleDeleteRepo(e, repo._id)}
                      className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 absolute top-4 right-4"
                      title="Delete Repository"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                    {repo.repoName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed h-10 font-medium">
                    {repo.description || "Project module repository for managing environment configurations."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-card-border/50">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${repo.port ? 'bg-green-400' : 'bg-gray-200'}`}></span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {repo.port ? `PORT: ${repo.port}` : 'UNCONFIGURED'}
                      </span>
                    </div>
                    <span className="text-primary font-bold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center tracking-widest uppercase">
                      Open <span className="ml-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
              );
            })}
            
            {/* Add Repo Card */}
            <CreateRepoModal fetchRepos={fetchWorkspaceData} projectId={id} customTrigger={
              <button className="h-full min-h-[220px] bg-transparent border-2 border-dashed border-card-border rounded-[14px] flex flex-col items-center justify-center group hover:border-primary/50 hover:bg-white transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="w-100 text-gray-400 font-bold text-sm group-hover:text-primary transition-colors">Add Module</span>
              </button>
            } />
        </div>
      )}
    </MainLayout>
  );
};

export default ProjectWorkspace;
