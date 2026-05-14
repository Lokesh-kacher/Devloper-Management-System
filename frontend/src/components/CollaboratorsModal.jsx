import React, { useState } from "react";
import ReactDOM from "react-dom";
import API from "../api/axios";

const CollaboratorsModal = ({ projectId, collaborators, fetchProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${projectId}/add-collaborator`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, type: "success" });
      setEmail("");
      fetchProject(); // Refresh project data to show new collaborator
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to add collaborator",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    if (!window.confirm("Are you sure you want to remove this collaborator?")) return;

    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/projects/${projectId}/remove-collaborator`,
        { collaboratorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProject();
    } catch (error) {
      console.error("Failed to remove collaborator:", error);
    }
  };

  const modalContent = isOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 font-tnr overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sidebar-bg/60 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative z-[10000] animate-in zoom-in-95 duration-200 border border-card-border">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Project Access</h2>
              <p className="text-gray-500 font-medium mt-1">Manage who can view and edit this project.</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessage({ text: "", type: "" });
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Add Collaborator Form */}
          <form onSubmit={handleAddCollaborator} className="mb-8">
            <div className="relative group">
              <input
                type="email"
                placeholder="User email address..."
                className="w-full border border-card-border p-4 pr-32 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900 bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-primary text-white px-5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "..." : "Invite"}
              </button>
            </div>
            {message.text && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-bold flex items-center space-x-2 ${
                message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                <span>{message.type === "success" ? "✓" : "!"}</span>
                <span>{message.text}</span>
              </div>
            )}
          </form>

          {/* Current Collaborators List */}
          <div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Team Members</h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {collaborators?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-card-border">
                  <p className="text-gray-400 font-medium text-sm">No collaborators added yet.</p>
                </div>
              ) : (
                collaborators?.map((collab) => (
                  <div key={collab._id} className="flex items-center justify-between p-4 bg-white border border-card-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex justify-center items-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {collab.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{collab.name}</p>
                        <p className="text-gray-500 text-xs truncate">{collab.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCollaborator(collab._id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Collaborator"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-5 py-2 bg-white border border-card-border rounded-full hover:bg-gray-50 transition-all text-gray-600 font-bold text-sm shadow-sm active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Collaborators</span>
        {collaborators?.length > 0 && (
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
            {collaborators.length}
          </span>
        )}
      </button>
      {isOpen && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default CollaboratorsModal;
