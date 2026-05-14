import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const navItems = [
    {
      label: "Dashboard", path: "/dashboard", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: "Settings", path: "/settings", icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
  ];

  return (
    <aside className="w-[200px] bg-sidebar-bg flex flex-col sticky top-0 h-screen shrink-0 overflow-y-auto custom-scrollbar font-tnr">
      <div className="p-6 mb-4">
        <h1 className="text-2xl font-bold text-white tracking-tighter">Welcome Back </h1>
        <p className="text-[10px] text-gray-500 font-bold tracking-[2px] uppercase mt-1"></p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center space-x-3 px-4 py-2.5 w-full rounded-full transition-all group ${isActive(item.path)
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
          >
            <div className={`transition-opacity ${isActive(item.path) ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
              {item.icon}
            </div>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 space-y-4">

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="flex items-center justify-center space-x-2 w-full py-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest group"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
