import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const user = useStore((state) => state.user);
  const authLoading = useStore((state) => state.authLoading);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-neon-blue mb-4" />
        <p className="text-sm font-semibold tracking-wide uppercase">Initializing Momentum...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
