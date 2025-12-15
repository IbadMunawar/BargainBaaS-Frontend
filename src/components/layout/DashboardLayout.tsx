import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // ADDED useEffect
import { LayoutDashboard, Key, Settings, Book, Menu, X, LogOut, Code } from 'lucide-react';

// Define the structure for the sidebar links
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
  // REPLACED placeholder state with dynamic state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Developer'); // State for the dynamic user name
  
  // This effect runs once to read the user's name/email from local storage
  useEffect(() => {
    // We check for the name first, and fall back to the email if the name isn't set
    const storedName = localStorage.getItem('user_name');
    const storedEmail = localStorage.getItem('user_email');
    
    if (storedName) {
      setUserName(storedName.split(' ')[0]); // Use first name if available
    } else if (storedEmail) {
      setUserName(storedEmail); // Fall back to email
    }
  }, []); // Run only on initial mount

  // Functional logout logic
  const handleLogout = () => {
    // 1. Clear all authentication tokens and user info
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');

    // 2. Redirect the user to the login page
    window.location.href = '/auth/login'; 
  };
  // END REPLACEMENT

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-0 left-0 p-4 z-40 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-700 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar (Fixed on Desktop, Modal on Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 bg-primary-900 overflow-y-auto transition-transform duration-300 ease-in-out md:shadow-lg flex flex-col`}
        onClick={() => setSidebarOpen(false)} // Close sidebar when clicking outside on mobile
      >
        <div className="flex items-center justify-between p-6 h-16 bg-primary-950 shadow-md">
          <Link href="/dashboard" className="text-2xl font-bold text-white tracking-wider">
            Bargain<span className="text-primary-300">BaaS</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-2">
          {dashboardLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center px-4 py-3 text-sm font-medium text-primary-200 rounded-lg hover:bg-primary-700 hover:text-white transition duration-150"
            >
              <link.icon className="h-5 w-5 mr-3" />
              {link.name}
            </Link>
          ))}
          
          {/* External Link to Public Site */}
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-4 py-3 text-sm font-medium text-primary-200 rounded-lg hover:bg-primary-700 hover:text-white transition duration-150 border-t border-primary-700 mt-4 pt-4"
          >
            <Code className="h-5 w-5 mr-3" />
            View Public Site
          </a>
        </nav>
        
        {/* Footer/Logout */}
        <div className="p-4 border-t border-primary-700">
             <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-300 rounded-lg hover:bg-primary-700 hover:text-white transition duration-150"
             >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
            </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        
        {/* Header Bar */}
        <header className="h-16 flex items-center justify-end bg-white border-b border-gray-200 shadow-sm px-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium hidden sm:inline">Welcome, {userName}</span>
            {/* UPDATED Avatar to use dynamic state */}
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 font-semibold">
                {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg min-h-[80vh] border border-gray-100">
                {children}
            </div>
        </main>
      </div>
      
    </div>
  );
};

export default DashboardLayout;