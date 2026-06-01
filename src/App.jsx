import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './hooks/useStore';
import { authService } from './services/auth';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Navigation from './components/ui/Navigation';
import ToastContainer from './components/ui/ToastContainer';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';

// App Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Focus from './pages/Focus/Focus';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

export default function App() {
  const initApp = useStore((state) => state.initApp);
  const setAuthLoading = useStore((state) => state.setAuthLoading);

  useEffect(() => {
    setAuthLoading(true);
    // Listen to changes in real Firebase or Mock Authentication
    const unsubscribe = authService.onAuthChange((user) => {
      initApp(user);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initApp, setAuthLoading]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected operating system routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigation />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Navigation />
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus"
          element={
            <ProtectedRoute>
              <Navigation />
              <Focus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Navigation />
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Navigation />
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Default Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
