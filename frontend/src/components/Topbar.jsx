import React from "react";

const Topbar = ({ title, breadcrumbs, actions }) => {
  return (
    <header className="h-16 bg-main-bg border-b border-card-border/50 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-md bg-opacity-80 font-tnr">
      <div className="flex flex-col">
        {breadcrumbs && (
          <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                {crumb.link ? (
                  <a href={crumb.link} className="hover:text-primary transition-colors">{crumb.label}</a>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {actions}
      </div>
    </header>
  );
};

export default Topbar;
