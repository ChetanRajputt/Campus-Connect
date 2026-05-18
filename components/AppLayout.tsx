'use client';

import { useAuth } from '@/context/AuthContext';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: '4px solid #334155',
            borderTopColor: '#ff9500',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  // If not logged in, just show the content (e.g. Login / Signup page)
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {children}
      </Box>
    );
  }

  // Logged in: Show responsive layout
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        width: '100%',
        paddingTop: { xs: 0, md: 'env(safe-area-inset-top)' },
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Top Bar for Mobile */}
      {isMobile && <TopBar />}

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          width: '100%',
          minHeight: 0,
        }}
      >
        {/* Left Sidebar (Desktop) */}
        {!isMobile && (
          <Box
            sx={{
              width: { md: 260, lg: 280 },
              height: '100vh',
              overflowY: 'auto',
              borderRight: '1px solid #334155',
              position: 'sticky',
              top: 0,
              flexShrink: 0,
              paddingTop: 'env(safe-area-inset-top)',
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            minWidth: 0,
            maxWidth: '100%',
            width: '100%',
            pb: { xs: 'calc(64px + env(safe-area-inset-bottom))', md: 2 },
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && <BottomNav />}
    </Box>
  );
}
