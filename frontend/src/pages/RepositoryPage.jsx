import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

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
            className="flex items-center space-x-3 p-3 w-full text-gray-500 hover:bg-gray-100 rounded-xl transition-all text-left"
          >
            <span>📁</span>
            <span>Projects</span>
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

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
           <div className="flex items-center space-x-2 text-sm text-gray-400 font-medium">
             <Link to="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link>
             <span>/</span>
             <span className="text-gray-600">{repo?.repoName}</span>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto w-full">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{repo?.repoName}</h1>
              <p className="text-gray-500 text-lg">{repo?.description || "Configure repository settings"}</p>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-gray-400 block mb-1 tracking-widest">ACTIVE PORT</span>
               <span className="text-2xl font-mono font-bold text-primary bg-secondary/10 px-5 py-2 rounded-2xl border border-secondary/20">
                 {repo?.port || "NONE"}
               </span>
            </div>
          </div>

          <div className="flex space-x-3 mb-8 bg-gray-200/40 p-1.5 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("port")}
              className={`px-10 py-3 rounded-xl font-bold transition-all ${activeTab === "port" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Port No.
            </button>
            <button 
              onClick={() => setActiveTab("env")}
              className={`px-10 py-3 rounded-xl font-bold transition-all ${activeTab === "env" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              ENV
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
            {activeTab === "port" ? (
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-2">Port Configuration</h2>
                <p className="text-gray-500 mb-8 text-sm">Set the internal port where this module will run.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-3 tracking-widest">LISTENING PORT</label>
                    <input 
                      type="number" 
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                      placeholder="e.g. 3000"
                      className="w-full border border-gray-100 bg-gray-50 p-5 rounded-[1.5rem] focus:ring-2 focus:ring-primary focus:bg-white outline-none text-2xl font-mono shadow-inner transition-all"
                    />
                  </div>
                  <button onClick={handleUpdatePort} disabled={saving} className="w-full bg-primary text-white p-5 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-gray-100">
                    {saving ? "Saving..." : "Save Configuration"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(repo?.environments || {}).map((env) => (
                      <button 
                        key={env}
                        onClick={() => setEnvMode(env)}
                        className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${envMode === env ? "bg-primary border-primary text-white shadow-lg shadow-secondary/20" : "border-gray-50 text-gray-400 hover:border-gray-200"}`}
                      >
                        {env.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      placeholder="Add Env..."
                      value={newEnvName}
                      onChange={(e) => setNewEnvName(e.target.value)}
                      className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-primary transition-all w-32"
                    />
                    <button onClick={handleCreateEnv} className="bg-primary text-white p-2.5 rounded-xl hover:opacity-90 transition-all shadow-sm">➕</button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-bold uppercase tracking-tight flex items-center space-x-3">
                      <span>{envMode} Variables</span>
                      <button onClick={handleDeleteEntireEnv} className="text-[10px] bg-red-50 text-red-400 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition-all font-black">DELETE ENV</button>
                   </h2>
                </div>

                <div className="flex-1 flex flex-col relative group">
                  <textarea 
                    value={envText}
                    onChange={(e) => setEnvText(e.target.value)}
                    placeholder={`# Paste your ${envMode} .env content here...`}
                    className="flex-1 w-full p-8 bg-gray-900 text-green-400 font-mono text-sm rounded-[2rem] border-none outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-inner resize-none min-h-[350px]"
                    spellCheck="false"
                  />
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-600 opacity-50">.env editor</div>
                </div>

                <button 
                  onClick={handleSaveCurrentEnv}
                  disabled={saving}
                  className="mt-6 w-full bg-primary text-white p-5 rounded-[1.5rem] font-bold hover:opacity-90 transition-all shadow-xl shadow-secondary/20 flex items-center justify-center space-x-2"
                >
                  {saving ? "Saving..." : (
                    <>
                      <span>💾</span>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryPage;