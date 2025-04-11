// src/router.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import App from './App';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/Dashboard';
import { QuestionsManager } from './components/admin/QuestionsManager';
import { PersonalitiesManager } from './components/admin/PersonalitiesManager';
import { SettingsManager } from './components/admin/SettingsManager';
import { AnalyticsManager } from './components/admin/AnalyticsManager';
import { Login } from './components/admin/Login';
import { useAuth } from './contexts/AuthContext';
import { Suspense, lazy } from 'react';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Router setup
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/admin',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            Loading...
          </div>
        }
      >
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <AdminDashboard />,
      },
      {
        path: 'questions',
        element: <QuestionsManager />,
      },
      {
        path: 'personalities',
        element: <PersonalitiesManager />,
      },
      {
        path: 'settings',
        element: <SettingsManager />,
      },
      {
        path: 'analytics',
        element: <AnalyticsManager />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
]);

// Router provider component
export const Router = () => {
  return <RouterProvider router={router} />;
};
