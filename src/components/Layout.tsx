import React, { ReactNode } from 'react';
type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Interactive Data Visualization Dashboard' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-800">{title}</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;