'use client';

import { useAuth } from '@/context/AuthContext';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        display: { xs: 'block', md: 'none' },
        zIndex: 1000,
        backgroundColor: '#121212',
        borderTop: '1px solid #2d2d2d',
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{ backgroundColor: 'transparent' }}
      >
        <BottomNavigationAction 
          label="Feed" 
          value="/feed" 
          icon={<HomeIcon />} 
          sx={{ color: pathname === '/feed' ? '#FF9800' : '#a0aec0' }}
        />
        <BottomNavigationAction 
          label="Messages" 
          value="/messages" 
          icon={<ChatIcon />} 
          sx={{ color: pathname === '/messages' ? '#FF9800' : '#a0aec0' }}
        />
        <BottomNavigationAction 
          label="Alerts" 
          value="/notifications" 
          icon={<NotificationsIcon />} 
          sx={{ color: pathname === '/notifications' ? '#FF9800' : '#a0aec0' }}
        />
        <BottomNavigationAction 
          label="Profile" 
          value="/profile" 
          icon={<PersonIcon />} 
          sx={{ color: pathname === '/profile' ? '#FF9800' : '#a0aec0' }}
        />
      </BottomNavigation>
    </Paper>
  );
}
