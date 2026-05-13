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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-[10000] animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Project Access</h2>
              <p className="text-gray-500 text-sm mt-1">Manage who can view and edit this project.</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessage({ text: "", type: "" });
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Add Collaborator Form */}
          <form onSubmit={handleAddCollaborator} className="mb-8">
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter user email address..."
                className="w-full border-2 border-gray-100 p-4 pr-32 rounded-2xl focus:outline-none focus:border-primary transition-all text-gray-700 bg-gray-50 group-hover:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-xl font-bold hover:opacity-90 disabled:bg-muted transition-all shadow-md active:scale-95"
              >
                {loading ? "Adding..." : "Invite"}
              </button>
            </div>
            {message.text && (
              <p className={`mt-3 text-sm font-medium px-4 py-2 rounded-lg ${
                message.type === "success" ? "bg-accent text-gray-800" : "bg-red-50 text-red-600"
              }`}>
                {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
              </p>
            )}
          </form>

          {/* Current Collaborators List */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Team Members</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {collaborators?.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 text-sm">No collaborators added yet.</p>
                </div>
              ) : (
                collaborators?.map((collab) => (
                  <div key={collab._id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-secondary hover:shadow-sm transition-all group">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex justify-center items-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
                        {collab.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{collab.name}</p>
                        <p className="text-gray-400 text-xs">{collab.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCollaborator(collab._id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Collaborator"
                    >
                      ✕
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
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600 font-semibold shadow-sm"
      >
        <span>👥</span>
        <span>Collaborators</span>
        {collaborators?.length > 0 && (
          <span className="bg-secondary/20 text-primary px-2 py-0.5 rounded-lg text-xs">
            {collaborators.length}
          </span>
        )}
      </button>
      {isOpen && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default CollaboratorsModal;
