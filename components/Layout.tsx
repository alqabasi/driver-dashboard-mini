import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, LayoutDashboard, Menu, X } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold tracking-tight">AdminPanel</span>
          <button className="ml-auto lg:hidden" onClick={closeSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavLink 
            to="/dashboard/users"
            onClick={closeSidebar}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive ? 'bg-accent text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
          >
            <Users className="w-5 h-5" />
            Users
          </NavLink>
          {/* Placeholder for future links */}
          <button disabled className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed">
            <LayoutDashboard className="w-5 h-5" />
            Analytics (Coming Soon)
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4">
          <button onClick={toggleSidebar} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-semibold text-slate-900">Dashboard</span>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
