'use client';

import { useAuth } from '@/context/AuthContext';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Box sx={{ minHeight: '100vh', backgroundColor: '#121212' }} />;
  }

  // If not logged in, just show the content (e.g. Login / Signup page)
  if (!user) {
    return <Box sx={{ minHeight: '100vh', backgroundColor: '#121212' }}>{children}</Box>;
  }

  // Logged in: Show 3-column layout
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
      {/* Left Sidebar (Desktop) */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, width: 260, flexShrink: 0 }}>
        <Sidebar />
      </Box>

      {/* Main Content (Center) */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          minWidth: 0, 
          pb: { xs: 8, md: 0 }, // Padding bottom for mobile bottom nav
          // On large screens, allow the content to fill the space
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </Box>
  );
}
