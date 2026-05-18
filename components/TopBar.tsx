'use client';

import { Box, AppBar, IconButton, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut();
    router.push('/auth/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    router.push('/profile');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        zIndex: 1100,
        top: 0,
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 2vw, 1rem)',
          minHeight: 'clamp(48px, 8vw, 56px)',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            color: '#ff9500',
            fontWeight: 800,
            fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          }}
        >
          <Box component="span">{'</>'}</Box>
          <Typography
            sx={{
              fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Campus
          </Typography>
        </Link>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* User Avatar Menu */}
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              p: 'clamp(0.25rem, 0.5vw, 0.5rem)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            <Avatar
              sx={{
                width: 'clamp(36px, 8vw, 40px)',
                height: 'clamp(36px, 8vw, 40px)',
                backgroundColor: '#ff9500',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                minWidth: 'clamp(160px, 90vw, 200px)',
                maxWidth: '90vw',
              },
            }}
          >
            <MenuItem
              onClick={handleProfileClick}
              sx={{
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                padding: 'clamp(8px, 1vh, 12px) clamp(12px, 2vw, 16px)',
                minHeight: '44px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 149, 0, 0.1)',
                },
              }}
            >
              View Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                color: '#ef4444',
                padding: 'clamp(8px, 1vh, 12px) clamp(12px, 2vw, 16px)',
                minHeight: '44px',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </AppBar>
  );
}
