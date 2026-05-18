'use client';

// components/NavBar.tsx
// यह navigation bar है जो सभी pages में दिखता है
// This is the navigation bar visible on all pages

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  Badge,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const { user, session, signOut, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toISOString());

  useEffect(() => {
    if (!user) return;
    
    // Attempt WebSocket connection
    const channel = supabase.channel('navbar_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          if (pathname !== '/messages') setHasNewMessage(true);
        }
      )
      .subscribe();

    // FALLBACK: Polling for browsers (like Brave) that block WebSockets
    const pollInterval = setInterval(async () => {
      // Don't poll if we're already showing the badge or if we are on the messages page
      if (pathname === '/messages' || hasNewMessage) return;

      const { data } = await supabase
        .from('messages')
        .select('created_at')
        .eq('receiver_id', user.id)
        .gt('created_at', lastCheckTime)
        .limit(1);

      if (data && data.length > 0) {
        setHasNewMessage(true);
        setLastCheckTime(new Date().toISOString());
      }
    }, 5000); // Check every 5 seconds

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [user, pathname, hasNewMessage, lastCheckTime]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    handleMenuClose();
  };

  if (loading) {
    return (
      <AppBar position="fixed">
        <Toolbar>
          <CircularProgress size={24} sx={{ color: 'white' }} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
        boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)',
      }}
    >
      <Toolbar sx={{ height: '80px', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              cursor: 'pointer', 
              fontWeight: 700,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🎓 CampusConnect+
          </Typography>
        </Link>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          {session ? (
            <>
              <Link href="/feed" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  Feed
                </Button>
              </Link>
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  Profile
                </Button>
              </Link>
              <Link href="/messages" style={{ textDecoration: 'none' }} onClick={() => setHasNewMessage(false)}>
                <Badge color="error" variant="dot" invisible={!hasNewMessage}>
                  <Button 
                    color="inherit"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    💬 Messages
                  </Button>
                </Badge>
              </Link>
              {isAdmin && (
                <Link href="/admin" style={{ textDecoration: 'none' }}>
                  <Button 
                    color="inherit"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                  >
                    Admin
                  </Button>
                </Link>
              )}
              <Button 
                color="inherit" 
                onClick={handleMenuOpen}
                sx={{ fontWeight: 600 }}
              >
                {user?.full_name || 'Account'}
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                <Button 
                  color="inherit"
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
