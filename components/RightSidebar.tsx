'use client';

import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

export default function RightSidebar() {
  const trendingTopics = [
    '#typescript', '#reactjs', '#nextjs14', '#webdev', '#supabase', '#uiux'
  ];

  const officialChannels = [
    { name: 'VS Code', icon: '💻' },
    { name: 'React', icon: '⚛️' },
    { name: 'Shadcn/UI', icon: '🎨' },
    { name: 'ChatGPT', icon: '🤖' },
  ];

  return (
    <Box
      sx={{
        width: 320,
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        borderLeft: '1px solid #2d2d2d',
        backgroundColor: '#121212',
        px: 3,
        py: 4,
        overflowY: 'auto',
      }}
    >
      {/* Trending Topics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Trending Campus Topics
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {trendingTopics.map(topic => (
            <Chip 
              key={topic} 
              label={topic} 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                color: '#9ca3af',
                border: '1px solid #2d2d2d',
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#FF9800', borderColor: '#FF9800' }
              }} 
            />
          ))}
        </Box>
      </Box>

      {/* Official Channels */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Campus Communities
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {officialChannels.map(channel => (
            <Box key={channel.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 1, backgroundColor: '#0a0a0a', border: '1px solid #2d2d2d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {channel.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>{channel.name}</Typography>
              </Box>
              <Button size="small" startIcon={<AddIcon fontSize="small"/>} sx={{ color: '#FF9800', p: 0, minWidth: 0, textTransform: 'none', '&:hover': { color: '#F57C00', backgroundColor: 'transparent' } }}>
                Follow
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
