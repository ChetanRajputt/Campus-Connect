'use client';

// app/feed/page.tsx
// यह feed page है जहाँ सभी posts दिखते हैं
// This is the feed page where all posts are displayed

import { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import CreatePost from '@/components/CreatePost';
import PostCard from '@/components/PostCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Post, User } from '@/utils/supabase';

export default function Feed() {
  const [posts, setPosts] = useState<(Post & { users?: User })[]>([]);
  const [loading, setLoading] = useState(true);

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
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          {/* Header tabs (Following / Featured / Rising) */}
          <Box sx={{ display: 'flex', gap: 3, mb: 3, px: 1, borderBottom: '1px solid #2d2d2d', pb: 2 }}>
             <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: '#fff' }}>
                <span style={{ color: '#f44336' }}>❤️</span> Following
             </Typography>
             <Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: '#a0aec0', '&:hover': { color: '#fff' } }}>
                🔥 Featured
             </Typography>
             <Typography sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', color: '#a0aec0', '&:hover': { color: '#fff' } }}>
                🚀 Rising
             </Typography>
          </Box>

          <Box>
            <CreatePost onPostCreated={fetchPosts} />

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2, color: '#a0aec0' }}>Loading posts...</Typography>
              </Box>
            ) : posts.length > 0 ? (
              <Box sx={{ mt: 4 }}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    onRefresh={fetchPosts}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: '#a0aec0', mb: 1 }}>
                  कोई posts नहीं | No posts yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Be the first to create a post! 🚀
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
