// src/components/admin/AdminLayout.tsx
import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  FileQuestion,
  User,
  BarChart,
} from 'lucide-react';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authContext = useAuth();
  const logout = authContext?.logout;
  const user = authContext?.user;
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    {
      name: 'Questions',
      path: '/admin/questions',
      icon: <FileQuestion size={20} />,
    },
    {
      name: 'Personalities',
      path: '/admin/personalities',
      icon: <User size={20} />,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart size={20} />,
    },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } fixed inset-0 z-20 transition-opacity bg-black bg-opacity-50 lg:hidden`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-purple-800 text-white transition duration-300 transform lg:translate-x-0 lg:relative lg:z-0`}
      >
        <div className="flex items-center justify-between px-4 py-6">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Avrudu Quiz Admin</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`${
                    isActive(item.path)
                      ? 'bg-purple-900 text-white'
                      : 'text-white hover:bg-purple-700'
                  } flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-purple-300">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={toggleSidebar}
              className="p-1 text-gray-500 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Menu size={24} />
            </button>
            <div className="text-xl font-bold text-purple-900 lg:hidden">
              Avrudu Quiz Admin
            </div>
            <div className="flex items-center">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors duration-200"
              >
                <HelpCircle size={18} className="mr-1" />
                <span>View Quiz</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
