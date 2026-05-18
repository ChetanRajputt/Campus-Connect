'use client';

import { useAuth } from '@/context/AuthContext';
import { Paper, BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const routes = [
    { label: 'Feed', value: '/feed', icon: <HomeIcon /> },
    { label: 'Create', value: '/create-post', icon: <AddCircleOutlineIcon /> },
    { label: 'Messages', value: '/messages', icon: <ChatIcon /> },
    { label: 'Alerts', value: '/notifications', icon: <NotificationsIcon /> },
    { label: 'Profile', value: '/profile', icon: <PersonIcon /> },
  ];

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#1e293b',
        borderTop: '1px solid #334155',
        display: { xs: 'block', md: 'none' },
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.2)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        width: '100%',
      }}
      elevation={0}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{
          backgroundColor: 'transparent',
          height: 'auto',
          minHeight: 'clamp(56px, 10vw, 80px)',
          padding: { xs: '8px 0 0 0', sm: '12px 0 0 0' },
          '& .MuiBottomNavigationAction-root': {
            flex: 1,
            minWidth: 'auto',
            padding: 'clamp(8px, 1vh, 12px) clamp(4px, 1vw, 8px)',
            fontSize: 'clamp(0.65rem, 0.75vw, 0.75rem)',
            fontWeight: 500,
            color: '#94a3b8',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            minHeight: 'auto',
            '&.Mui-selected': {
              color: '#ff9500',
              fontWeight: 700,
              '& .MuiSvgIcon-root': {
                fontSize: 'clamp(1.5rem, 2vw, 1.75rem)',
              },
            },
            '& .MuiSvgIcon-root': {
              fontSize: 'clamp(1.5rem, 2vw, 1.75rem)',
              transition: 'font-size 0.2s ease',
            },
          },
        }}
      >
        {routes.map((route) => (
          <BottomNavigationAction
            key={route.value}
            label={route.label}
            value={route.value}
            icon={route.icon}
            sx={{
              '&.Mui-selected': {
                color: '#ff9500',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
