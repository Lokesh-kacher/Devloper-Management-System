import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children, title, breadcrumbs, actions }) => {
  return (
    <div className="flex min-h-screen bg-main-bg font-tnr selection:bg-primary/20">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <Topbar title={title} breadcrumbs={breadcrumbs} actions={actions} />
        <div className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
