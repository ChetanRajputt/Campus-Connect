'use client';

import { useAuth } from '@/context/AuthContext';
import { Box, Typography, Button, Avatar, IconButton, Badge } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Sidebar() {
  const { user, signOut, isAdmin } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { label: 'My Feed', icon: <HomeIcon />, path: '/feed' },
    { label: 'Groups', icon: <GroupsIcon />, path: '/groups' },
    { label: 'Messages', icon: <ChatIcon />, path: '/messages' },
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #2d2d2d',
        backgroundColor: '#121212',
        px: 3,
        py: 4,
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', color: 'white', marginBottom: '40px' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            color: '#FF9800'
          }}
        >
          {/* Logo icon representation */}
          <Box component="span" sx={{ fontSize: '1.2rem' }}>{'</>'}</Box>
          CampusConnect
        </Typography>
      </Link>

      {/* Navigation Links */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  color: isActive ? '#FF9800' : '#a0aec0',
                  backgroundColor: isActive ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FF9800' : '#ffffff',
                  },
                }}
              >
                {item.icon}
                <Typography sx={{ fontWeight: isActive ? 700 : 500, fontSize: '1rem' }}>
                  {item.label}
                </Typography>
              </Box>
            </Link>
          );
        })}
        {isAdmin && (
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                color: pathname === '/admin' ? '#FF9800' : '#a0aec0',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff' },
              }}
            >
              <AdminPanelSettingsIcon />
              <Typography sx={{ fontWeight: 500 }}>Admin</Typography>
            </Box>
          </Link>
        )}
      </Box>

      {/* Profile Section at Bottom */}
      {user && (
        <Box 
          sx={{ 
            mt: 'auto',
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none', cursor: 'pointer' }} component={Link} href="/profile">
            <Avatar src={user.avatar_url || ''} sx={{ width: 40, height: 40, backgroundColor: '#2d2d2d' }}>
              {user.full_name?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                {user.full_name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                @{user.full_name?.split(' ')[0].toLowerCase()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleLogout} sx={{ color: '#a0aec0', '&:hover': { color: '#f44336' } }}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
