'use client';

import { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Post, User } from '@/utils/supabase';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useAuth } from '@/context/AuthContext';

export default function Announcements() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<(Post & { users?: User })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => 
    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, users(*)')
        .eq('is_announcement', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4, px: 1, borderBottom: '1px solid #2d2d2d', pb: 2 }}>
             <CampaignIcon sx={{ color: '#FF9800', fontSize: 32 }} />
             <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                Official Announcements
             </Typography>
          </Box>

          <Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search announcements by keyword, title, or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#a0aec0' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#161616',
                    borderRadius: '12px',
                    '& fieldset': { borderColor: '#2d2d2d' },
                    '&:hover fieldset': { borderColor: '#404040' },
                    '&.Mui-focused fieldset': { borderColor: '#FF9800' },
                    color: '#fff',
                  }
                }}
              />
            </Box>

            {isAdmin && <CreatePost onPostCreated={fetchPosts} />}

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#FF9800' }} />
                <Typography sx={{ mt: 2, color: '#a0aec0' }}>Loading announcements...</Typography>
              </Box>
            ) : filteredPosts.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    onRefresh={fetchPosts}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#161616', borderRadius: 2, border: '1px solid #2d2d2d' }}>
                <CampaignIcon sx={{ fontSize: 60, color: '#404040', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#a0aec0', mb: 1 }}>
                  No announcements yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Official college updates will appear here. 📢
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
