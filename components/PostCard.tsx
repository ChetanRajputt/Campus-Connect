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
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<(CommentType & { users?: User })[]>([]);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
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
        setLikesCount(prev => prev - 1);
        // Optional: Update db count directly if RLS allows, but a database trigger is better.
        supabase.from('posts').update({ likes_count: likesCount - 1 }).eq('id', post.id);
        setLiked(false);
      } else {
        // Like
        await supabase.from('likes').insert({
          post_id: post.id,
          user_id: user.id,
        });
        setLikesCount(prev => prev + 1);
        supabase.from('posts').update({ likes_count: likesCount + 1 }).eq('id', post.id);
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
        setCommentsCount(prev => prev + 1);
        supabase.from('posts').update({ comments_count: commentsCount + 1 }).eq('id', post.id);
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
      setCommentsCount(prev => prev - 1);
      supabase.from('posts').update({ comments_count: commentsCount - 1 }).eq('id', post.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Card
      sx={{
        mb: { xs: 2, md: 3 },
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#475569',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          <Avatar
            src={post.users?.avatar_url || ''}
            sx={{
              backgroundColor: '#ff9500',
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              fontWeight: 700,
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              flexShrink: 0,
            }}
          >
            {post.users?.full_name?.[0]?.toUpperCase() ||
              post.users?.email?.[0]?.toUpperCase() ||
              'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  color: '#f1f5f9',
                }}
              >
                {post.users?.full_name || 'Anonymous'}
              </Typography>
              {post.users?.is_admin && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ADMIN
                </Box>
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: '#94a3b8',
                fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
              }}
            >
              {new Date(post.created_at).toLocaleString('en-IN')}
            </Typography>
          </Box>
          {(user?.id === post.user_id || isAdmin) && (
            <IconButton
              size="small"
              onClick={handleDeletePost}
              sx={{
                color: '#ef4444',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Announcement Badge */}
        {post.is_announcement && (
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                color: '#ff9500',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 700,
                border: '1px solid rgba(255, 149, 0, 0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              📢 ANNOUNCEMENT
            </Box>
          </Box>
        )}

        {/* Title */}
        {post.title && (
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 700,
              color: '#f1f5f9',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              wordBreak: 'break-word',
            }}
          >
            {post.title}
          </Typography>
        )}

        {/* Content */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            lineHeight: 1.6,
            color: '#cbd5e1',
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
          }}
        >
          {post.content}
        </Typography>

        {/* Image */}
        {post.image_url && (
          <Box
            component="img"
            src={post.image_url}
            alt="Post"
            sx={{
              width: '100%',
              maxHeight: { xs: 300, sm: 400 },
              objectFit: 'cover',
              borderRadius: '8px',
              mb: 2,
              border: '1px solid #334155',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#475569',
              },
            }}
          />
        )}
      </CardContent>

      {/* Actions */}
      <CardActions
        sx={{
          padding: { xs: '8px 12px', sm: '12px 16px' },
          gap: { xs: 2, sm: 3 },
          borderTop: '1px solid #334155',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={handleLike}
            onMouseEnter={checkLike}
            sx={{
              color: liked ? '#ff9500' : '#94a3b8',
              fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#ff9500',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
              },
            }}
          >
            {liked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)',
            }}
          >
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
              color: showComments ? '#ff9500' : '#94a3b8',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#ff9500',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
              },
            }}
          >
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)',
            }}
          >
            {commentsCount}
          </Typography>
        </Box>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent sx={{ borderTop: '1px solid #334155', pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                minRows={2}
                sx={{
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#0f172a',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{
                  whiteSpace: 'nowrap',
                  alignSelf: { xs: 'flex-end', sm: 'auto' },
                  minHeight: '40px',
                }}
              >
                Post
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {loadingComments ? (
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Loading comments...
              </Typography>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                />
              ))
            ) : (
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}
