'use client';

// app/feed/page.tsx
// यह feed page है जहाँ सभी posts दिखते हैं
// This is the feed page where all posts are displayed

import { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Post, User } from '@/utils/supabase';

export default function Feed() {
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#0f172a' }}>
        <Container maxWidth="md" sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, md: 4 } }}>


          {/* Search Box */}
          <Box sx={{ mb: { xs: 2, md: 3 } }}>
            <TextField
              fullWidth
              placeholder="Search posts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 'clamp(1.25rem, 1.5vw, 1.5rem)' }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  pl: 1,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderColor: '#334155',
                  '&:hover fieldset': { borderColor: '#475569' },
                  '&.Mui-focused fieldset': { borderColor: '#ff9500', borderWidth: '2px' },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: '#64748b',
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* Create Post */}
          <CreatePost onPostCreated={fetchPosts} />

          {/* Posts List */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
              <CircularProgress
                sx={{
                  color: '#ff9500',
                  fontSize: 'clamp(2rem, 3vw, 3rem)',
                }}
              />
              <Typography
                sx={{
                  mt: 2,
                  color: '#94a3b8',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                }}
              >
                Loading posts...
              </Typography>
            </Box>
          ) : filteredPosts.length > 0 ? (
            <Box sx={{ mt: { xs: 2, md: 4 } }}>
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
            <Box sx={{ textAlign: 'center', py: { xs: 6, md: 8 } }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#94a3b8',
                  mb: 1,
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                }}
              >
                {searchQuery ? 'No posts found' : 'No posts yet'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
                }}
              >
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Be the first to create a post! 🚀'}
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
