import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Key, Book, Menu, X, LogOut, Code, Cpu } from 'lucide-react';

// Configuration page removed from nav
const dashboardLinks = [
  { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
  { name: 'API Integration', href: '/dashboard/integration', icon: Key },
  { name: 'Documentation', href: '/dashboard/documentation', icon: Book },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Developer');

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    const storedEmail = localStorage.getItem('user_email');
    if (storedName) {
      setUserName(storedName.split(' ')[0]);
    } else if (storedEmail) {
      setUserName(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans antialiased">

      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-0 left-0 p-4 z-40 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 bg-white/5 backdrop-blur border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-slate-950/95 border-r border-white/10 overflow-y-auto transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center px-6 h-16 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-violet-600/20 rounded-lg border border-violet-500/30 group-hover:bg-violet-600/30 transition">
              <Cpu className="h-4 w-4 text-violet-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Bargain<span className="text-violet-400">BaaS</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-1">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dashboard
          </p>
          {dashboardLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-white/5 hover:text-white transition duration-150 group"
            >
              <link.icon className="h-4 w-4 mr-3 text-slate-500 group-hover:text-violet-400 transition" />
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              General
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 rounded-lg hover:bg-white/5 hover:text-white transition duration-150 group"
            >
              <Code className="h-4 w-4 mr-3 text-slate-500 group-hover:text-violet-400 transition" />
              View Public Site
            </a>
          </div>
        </nav>

        {/* Footer / User / Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="h-8 w-8 bg-violet-600/20 border border-violet-500/30 rounded-full flex items-center justify-center text-violet-400 font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-slate-500">Tenant</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition duration-150"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">

        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between bg-slate-900/80 backdrop-blur border-b border-white/10 px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-400 hidden sm:block">
              {pageTitle}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-400 hidden sm:inline">
              Welcome back, <span className="text-white font-medium">{userName}</span>
            </span>
            <div className="h-8 w-8 bg-violet-600/20 border border-violet-500/30 rounded-full flex items-center justify-center text-violet-400 font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">{pageTitle}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;