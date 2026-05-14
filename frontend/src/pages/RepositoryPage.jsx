import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import MainLayout from "../components/MainLayout";

const RepositoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("port"); 
  const [envMode, setEnvMode] = useState("development"); 
  const [port, setPort] = useState("");
  const [saving, setSaving] = useState(false);
  
  const [envText, setEnvText] = useState("");
  const [newEnvName, setNewEnvName] = useState("");

  const fetchRepoData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/repos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRepo(res.data);
      setPort(res.data.port || "");
      
      const envs = Object.keys(res.data.environments || {});
      const currentEnv = envMode && envs.includes(envMode) ? envMode : envs[0] || "development";
      setEnvMode(currentEnv);
      setEnvText(res.data.environments?.[currentEnv] || "");

    } catch (error) {
      console.error("Error fetching repository data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoData();
  }, [id]);

  useEffect(() => {
    if (repo) {
      setEnvText(repo.environments?.[envMode] || "");
    }
  }, [envMode, repo]);

  const handleUpdatePort = async () => {
    if (!port) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await API.put(`/repos/port/${id}`, { port }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRepoData();
    } catch (error) {
      console.error("Error updating port:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveAllEnvironments = async (updatedEnv) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await API.put(`/repos/env/${id}`, { environments: updatedEnv }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRepoData();
    } catch (error) {
      console.error("Error saving environments:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateEnv = () => {
    if (!newEnvName) return;
    const name = newEnvName.toLowerCase();
    const updatedEnv = { ...repo.environments };
    if (updatedEnv[name]) return;
    
    updatedEnv[name] = "";
    setNewEnvName("");
    setEnvMode(name);
    saveAllEnvironments(updatedEnv);
  };

  const handleSaveCurrentEnv = () => {
    const updatedEnv = { ...repo.environments };
    updatedEnv[envMode] = envText;
    saveAllEnvironments(updatedEnv);
  };

  const handleDeleteEntireEnv = () => {
    if (!window.confirm(`Delete the entire ${envMode} environment?`)) return;
    const updatedEnv = { ...repo.environments };
    delete updatedEnv[envMode];
    saveAllEnvironments(updatedEnv);
  };

  if (loading) return (
    <div className="h-screen flex justify-center items-center bg-main-bg">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const breadcrumbs = [
    { label: "Projects", link: "/dashboard" },
    { label: repo?.repoName || "Repository" }
  ];

  const topbarActions = (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Active Port</span>
        <span className="text-sm font-bold text-primary font-mono">{repo?.port || "NONE"}</span>
      </div>
    </div>
  );

  return (
    <MainLayout 
      title={repo?.repoName || "Repository"} 
      breadcrumbs={breadcrumbs}
      actions={topbarActions}
    >
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{repo?.repoName}</h1>
        <p className="text-gray-500 text-lg font-medium">{repo?.description || "Configure repository settings"}</p>
      </div>

      <div className="flex space-x-1 mb-8 bg-white border border-card-border p-1 rounded-full w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab("port")}
          className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "port" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-700"}`}
        >
          Port Configuration
        </button>
        <button 
          onClick={() => setActiveTab("env")}
          className={`px-8 py-2 rounded-full text-sm font-bold transition-all ${activeTab === "env" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-500 hover:text-gray-700"}`}
        >
          Environment Variables
        </button>
      </div>

      <div className="bg-white p-8 rounded-[24px] border border-card-border shadow-sm min-h-[500px] flex flex-col">
        {activeTab === "port" ? (
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Port Mapping</h2>
            <p className="text-gray-500 mb-8 font-medium">Define the port number for this repository.</p>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase">Internal Port</label>
                <input 
                  type="number" 
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="3000"
                  className="w-full border border-card-border bg-gray-50 p-4 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-3xl font-bold font-mono transition-all text-gray-900"
                />
              </div>
              <button 
                onClick={handleUpdatePort} 
                disabled={saving} 
                className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Save Port Configuration"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-card-border/50">
              <div className="flex flex-wrap gap-2">
                {Object.keys(repo?.environments || {}).map((env) => (
                  <button 
                    key={env}
                    onClick={() => setEnvMode(env)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border-2 ${envMode === env ? "bg-primary border-primary text-white shadow-md shadow-primary/20" : "border-gray-50 text-gray-400 hover:border-gray-200"}`}
                  >
                    {env.toUpperCase()}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="New Env..."
                  value={newEnvName}
                  onChange={(e) => setNewEnvName(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-card-border rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all w-32 font-bold"
                />
                <button onClick={handleCreateEnv} className="bg-primary text-white p-2 rounded-xl hover:shadow-md transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
               <h2 className="text-lg font-bold uppercase tracking-tight flex items-center space-x-3 text-gray-900">
                  <span>{envMode} .env</span>
                  <button 
                    onClick={handleDeleteEntireEnv} 
                    className="text-[10px] bg-red-50 text-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all font-bold tracking-widest"
                  >
                    DELETE
                  </button>
               </h2>
               <span className="text-[10px] font-bold text-gray-400 tracking-widest">ENCRYPTION ACTIVE</span>
            </div>

            <div className="flex-1 flex flex-col relative group">
              <textarea 
                value={envText}
                onChange={(e) => setEnvText(e.target.value)}
                placeholder={`# Variables for ${envMode}...`}
                className="flex-1 w-full p-6 bg-[#0F1117] text-green-500 font-mono text-sm rounded-2xl border-none outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner resize-none min-h-[300px]"
                spellCheck="false"
              />
            </div>

            <button 
              onClick={handleSaveCurrentEnv}
              disabled={saving}
              className="mt-6 w-full bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Apply Variables</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RepositoryPage;