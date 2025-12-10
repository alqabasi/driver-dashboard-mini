import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, LayoutDashboard, Menu, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="min-h-screen bg-slate-50 flex transition-all duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 text-white transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none border-r border-slate-800
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex-shrink-0
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64
      `}>
        {/* Header */}
        <div className={`h-16 flex items-center relative transition-all duration-300 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className={`w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 transition-all duration-300 ${isCollapsed ? 'scale-110' : ''}`}>
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span 
              className={`text-lg font-bold tracking-tight transition-all duration-300 origin-left ${isCollapsed ? 'w-0 opacity-0 scale-0' : 'w-auto opacity-100 scale-100'}`}
            >
              AdminPanel
            </span>
          </div>

          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={closeSidebar}>
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className={`
              hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700
              absolute -right-3 top-1/2 -translate-y-1/2 z-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-slate-900
            `}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <NavLink 
            to="/dashboard/users"
            onClick={closeSidebar}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${isActive 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? "Users" : undefined}
          >
            <Users className={`w-5 h-5 shrink-0 transition-colors ${isCollapsed ? '' : ''}`} />
            <span className={`whitespace-nowrap transition-all duration-300 origin-left ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
              Users
            </span>
            
            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
                Users
              </div>
            )}
          </NavLink>

          <button 
            disabled 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed group relative
             ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 origin-left ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
              Analytics
            </span>
            
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
                Analytics (Coming Soon)
              </div>
            )}
          </button>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={logout}
            className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors group relative
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 origin-left ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block'}`}>
              Sign Out
            </span>

            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700 shadow-xl transition-opacity">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-slate-50 transition-all duration-300">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shadow-sm z-30">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-semibold text-slate-900">Dashboard</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};