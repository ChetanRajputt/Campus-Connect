'use client';

// components/PostCard.tsx
// यह component एक single post को display करता है
// This component displays a single post

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Avatar,
  TextField,
  Button,
  Collapse,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import { Post, User, Comment as CommentType } from '@/utils/supabase';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';
import Comment from './Comment';

interface PostCardProps {
  post: Post & { users?: User };
  onDelete?: (postId: string) => void;
  onRefresh?: () => void;
}

export default function PostCard({ post, onDelete, onRefresh }: PostCardProps) {
  const { user, isAdmin } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<(CommentType & { users?: User })[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Check if user has liked this post
  const checkLike = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('likes')
      .select()
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .single();
    setLiked(!!data);
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        // Like
        await supabase.from('likes').insert({
          post_id: post.id,
          user_id: user.id,
        });
        setLikesCount(likesCount + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await supabase
        .from('comments')
        .select('*, users(*)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { data } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment,
        })
        .select('*, users(*)')
        .single();

      if (data) {
        setComments([data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await supabase.from('posts').delete().eq('id', post.id);
      onDelete?.(post.id);
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await supabase.from('comments').delete().eq('id', commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 3,
        backgroundColor: '#161616',
        border: '1px solid #2d2d2d',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid #404040',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          <Avatar 
            src={post.users?.avatar_url || ''} 
            sx={{
              backgroundColor: '#2d2d2d',
              width: 48,
              height: 48,
              fontWeight: 700,
            }}
          >
            {post.users?.full_name?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                {post.users?.full_name || 'Anonymous'}
              </Typography>
              {post.users?.is_admin && (
                <Box sx={{ 
                  backgroundColor: 'rgba(255, 152, 0, 0.2)',
                  color: '#FF9800',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}>
                  ADMIN
                </Box>
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
              {new Date(post.created_at).toLocaleString('en-IN')}
            </Typography>
          </Box>
          {(user?.id === post.user_id || isAdmin) && (
            <IconButton 
              size="small" 
              onClick={handleDeletePost}
              sx={{ color: '#ef4444' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {post.title && (
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              fontWeight: 700,
              color: '#fff'
            }}
          >
            {post.title}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6, color: '#e2e8f0' }}>
          {post.content}
        </Typography>

        {post.image_url && (
          <Box
            component="img"
            src={post.image_url}
            sx={{ 
              width: '100%', 
              maxHeight: 400, 
              objectFit: 'cover', 
              borderRadius: '8px', 
              mb: 2,
              border: '1px solid rgba(168, 85, 247, 0.2)',
            }}
          />
        )}
      </CardContent>

      <CardActions sx={{ padding: '12px 16px', gap: 3, borderTop: '1px solid #2d2d2d' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={handleLike} 
            onMouseEnter={checkLike}
            sx={{
              color: liked ? '#FF9800' : '#a0aec0',
              '&:hover': { color: '#FF9800', backgroundColor: 'rgba(255, 152, 0, 0.1)' }
            }}
          >
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
          <Typography variant="caption" sx={{ color: '#a0aec0', fontSize: '0.85rem' }}>
            {likesCount}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => {
              if (!showComments) loadComments();
              setShowComments(!showComments);
            }}
            sx={{
              color: showComments ? '#FF9800' : '#a0aec0',
              '&:hover': { color: '#FF9800', backgroundColor: 'rgba(255, 152, 0, 0.1)' }
            }}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" sx={{ color: '#a0aec0', fontSize: '0.85rem' }}>
            {post.comments_count}
          </Typography>
        </Box>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent sx={{ borderTop: '1px solid #2d2d2d', pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{
                  backgroundColor: '#FF9800',
                  color: '#000',
                  '&:hover': { backgroundColor: '#F57C00' },
                  '&:disabled': { opacity: 0.5 }
                }}
              >
                Post
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {loadingComments ? (
              <Typography variant="caption">Loading comments...</Typography>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))
            ) : (
              <Typography variant="caption" color="textSecondary">
                No comments yet
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}
