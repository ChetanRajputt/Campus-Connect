'use client';

// components/ProtectedRoute.tsx
// यह component protected routes के लिए है - सिर्फ logged-in users access कर सकते हैं
// This component protects routes - only logged-in users can access

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { session, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      } else if (adminOnly && !isAdmin) {
        // Redirect if admin access is required but user is not admin
        router.push('/feed');
      }
    }
  }, [session, loading, adminOnly, isAdmin, router]);

  if (loading || !session) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
