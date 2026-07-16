import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminRoute() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(true); // FOR MOCKUP: Force true

  useEffect(() => {
    // FOR MOCKUP: Bypass auth check
    setIsAdmin(true);
  }, [user, loading]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-4 border-dayli-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/auth" />;
}
