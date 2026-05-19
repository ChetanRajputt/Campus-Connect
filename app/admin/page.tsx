'use client';

import { useEffect, useState } from 'react';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';
import PostCard from '@/components/PostCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase, Post, User } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<(Post & { users?: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
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
    <ProtectedRoute adminOnly={true}>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            🔐 Admin Panel
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
           You can view and delete all posts
          </Alert>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handlePostDeleted}
                onRefresh={fetchAllPosts}
              />
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', py: 4 }}>
            No posts to manage
            </Typography>
          )}
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
