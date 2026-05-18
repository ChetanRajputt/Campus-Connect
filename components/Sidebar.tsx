'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Badge,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CampaignIcon from '@mui/icons-material/Campaign';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Sidebar() {
  const { user, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const navItems = [
    { label: 'My Feed', icon: <HomeIcon sx={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />, path: '/feed' },
    { label: 'Announcements', icon: <CampaignIcon sx={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />, path: '/announcements' },
    { label: 'Groups', icon: <GroupsIcon sx={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />, path: '/groups' },
    { label: 'Messages', icon: <ChatIcon sx={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }} />, path: '/messages' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#1e293b',
        px: { md: 3, lg: 4 },
        py: 3,
        gap: 2,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          color: 'inherit',
          marginBottom: 'clamp(1rem, 2vw, 2rem)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#ff9500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Box
            component="span"
            sx={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 800,
            }}
          >
            {'</>'}
          </Box>
          <Typography
            sx={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
            }}
          >
            Campus
          </Typography>
        </Box>
      </Link>

      {/* Navigation Links */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                  borderRadius: '8px',
                  color: isActive ? '#ff9500' : '#cbd5e1',
                  backgroundColor: isActive ? 'rgba(255, 149, 0, 0.1)' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: isActive ? '1px solid rgba(255, 149, 0, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  fontWeight: isActive ? 700 : 500,
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(255, 149, 0, 0.15)'
                      : 'rgba(100, 116, 139, 0.1)',
                    color: isActive ? '#ff9500' : '#f1f5f9',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <Divider
              sx={{
                my: 1,
                borderColor: '#334155',
              }}
            />
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  color: pathname === '/admin' ? '#3b82f6' : '#cbd5e1',
                  backgroundColor: pathname === '/admin' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  border: pathname === '/admin' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  fontWeight: pathname === '/admin' ? 700 : 500,
                  '&:hover': {
                    backgroundColor: pathname === '/admin'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'rgba(100, 116, 139, 0.1)',
                    color: '#f1f5f9',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <AdminPanelSettingsIcon
                  sx={{
                    fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  }}
                />
                <Typography sx={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)' }}>
                  Admin Panel
                </Typography>
              </Box>
            </Link>
          </>
        )}
      </Box>

      {/* Profile Section at Bottom */}
      {user && (
        <>
          <Divider sx={{ borderColor: '#334155' }} />
          <Link
            href="/profile"
            style={{
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'transparent',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 149, 0, 0.1)',
                },
              }}
            >
              <Avatar
                src={user.avatar_url || ''}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#ff9500',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#f1f5f9',
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.full_name || 'User'}
                </Typography>
                <Typography
                  sx={{
                    color: '#94a3b8',
                    fontSize: 'clamp(0.7rem, 0.8vw, 0.75rem)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  @{user.full_name?.split(' ')[0]?.toLowerCase() || 'user'}
                </Typography>
              </Box>
            </Box>
          </Link>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#f87171',
              },
            }}
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );
}
