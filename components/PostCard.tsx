'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Collapse,
  Divider,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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
  const [heartAnim, setHeartAnim] = useState(false);
  const lastTap = useRef(0);

  const triggerLike = async () => {
    if (!user) return;
    if (!liked) {
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 700);
    }
    try {
      if (liked) {
        await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
        setLikesCount(p => p - 1);
        supabase.from('posts').update({ likes_count: likesCount - 1 }).eq('id', post.id);
        setLiked(false);
      } else {
        await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
        setLikesCount(p => p + 1);
        supabase.from('posts').update({ likes_count: likesCount + 1 }).eq('id', post.id);
        setLiked(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      if (!liked) triggerLike();
    }
    lastTap.current = now;
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data } = await supabase
        .from('comments')
        .select('*, users(*)')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      setComments(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    try {
      const { data } = await supabase
        .from('comments')
        .insert({ post_id: post.id, user_id: user.id, content: newComment })
        .select('*, users(*)')
        .single();
      if (data) {
        setComments(prev => [...prev, data]);
        setNewComment('');
        setCommentsCount(p => p + 1);
        supabase.from('posts').update({ comments_count: commentsCount + 1 }).eq('id', post.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePost = async () => {
    try {
      await supabase.from('posts').delete().eq('id', post.id);
      onDelete?.(post.id);
      onRefresh?.();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await supabase.from('comments').delete().eq('id', commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setCommentsCount(p => p - 1);
      supabase.from('posts').update({ comments_count: commentsCount - 1 }).eq('id', post.id);
    } catch (e) {
      console.error(e);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1e293b',
        border: { xs: 'none', sm: '1px solid #2d3748' },
        borderRadius: { xs: 0, sm: '12px' },
        mb: { xs: '8px', sm: '16px' },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.25, gap: 1.5 }}>
        <Avatar
          src={post.users?.avatar_url || ''}
          sx={{
            width: 36,
            height: 36,
            backgroundColor: '#ff9500',
            fontSize: '0.85rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {post.users?.full_name?.[0]?.toUpperCase() || 'U'}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#f1f5f9', lineHeight: 1.2 }}>
            {post.users?.full_name || 'Anonymous'}
            {post.users?.is_admin && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontSize: '0.6rem',
                  backgroundColor: 'rgba(59,130,246,0.2)',
                  color: '#3b82f6',
                  px: '6px',
                  py: '1px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  verticalAlign: 'middle',
                }}
              >
                ADMIN
              </Box>
            )}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: '#64748b' }}>
            {timeAgo(post.created_at)}
          </Typography>
        </Box>

        {(user?.id === post.user_id || isAdmin) && (
          <IconButton size="small" onClick={handleDeletePost} sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' } }}>
            <DeleteIcon sx={{ fontSize: '1.1rem' }} />
          </IconButton>
        )}
      </Box>

      {/* ── Announcement Badge ── */}
      {post.is_announcement && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            backgroundColor: 'rgba(255,149,0,0.12)', color: '#ff9500',
            px: '10px', py: '3px', borderRadius: '20px',
            fontSize: '0.65rem', fontWeight: 700, border: '1px solid rgba(255,149,0,0.3)',
          }}>
            📢 ANNOUNCEMENT
          </Box>
        </Box>
      )}

      {/* ── Title ── */}
      {post.title && (
        <Box sx={{ px: 2, pb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>
            {post.title}
          </Typography>
        </Box>
      )}

      {/* ── Image (edge-to-edge, double-tap to like) ── */}
      {post.image_url && (
        <Box
          onClick={handleDoubleTap}
          sx={{ position: 'relative', cursor: 'pointer', userSelect: 'none', mt: post.title || post.content ? 1 : 0 }}
        >
          <Box
            component="img"
            src={post.image_url}
            alt="Post"
            sx={{
              width: '100%',
              maxHeight: { xs: 380, sm: 500 },
              objectFit: 'cover',
              display: 'block',
            }}
          />
          {/* Big heart animation on double tap */}
          {heartAnim && (
            <Box
              sx={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
                animation: 'heartPop 0.7s ease forwards',
                '@keyframes heartPop': {
                  '0%': { opacity: 0, transform: 'scale(0.5)' },
                  '30%': { opacity: 1, transform: 'scale(1.3)' },
                  '70%': { opacity: 1, transform: 'scale(1)' },
                  '100%': { opacity: 0, transform: 'scale(1.1)' },
                },
              }}
            >
              <FavoriteIcon sx={{ fontSize: '80px', color: '#fff', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
            </Box>
          )}
        </Box>
      )}

      {/* ── Content Text ── */}
      {post.content && (
        <Box sx={{ px: 2, pt: post.image_url ? 1.5 : 0.5, pb: 0.5 }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            <Box component="span" sx={{ fontWeight: 700, color: '#f1f5f9', mr: 0.5 }}>
              {post.users?.full_name?.split(' ')[0] || ''}
            </Box>
            {post.content}
          </Typography>
        </Box>
      )}

      {/* ── Action Row ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 0.5, pb: 0.5 }}>
        {/* Like */}
        <IconButton
          onClick={triggerLike}
          sx={{
            color: liked ? '#ff9500' : '#94a3b8',
            transition: 'all 0.15s ease',
            '&:hover': { backgroundColor: 'transparent', transform: 'scale(1.15)' },
            '&:active': { transform: 'scale(0.9)' },
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ fontSize: '1.5rem' }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: '1.5rem' }} />
          )}
        </IconButton>

        {/* Comment */}
        <IconButton
          onClick={() => { if (!showComments) loadComments(); setShowComments(p => !p); }}
          sx={{
            color: showComments ? '#ff9500' : '#94a3b8',
            '&:hover': { backgroundColor: 'transparent', transform: 'scale(1.1)' },
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: '1.4rem' }} />
        </IconButton>
      </Box>

      {/* ── Likes count ── */}
      <Box sx={{ px: 2, pb: 0.5 }}>
        {likesCount > 0 && (
          <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#f1f5f9' }}>
            {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
          </Typography>
        )}
      </Box>

      {/* ── View all comments link ── */}
      {commentsCount > 0 && !showComments && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            onClick={() => { loadComments(); setShowComments(true); }}
            sx={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', '&:hover': { color: '#94a3b8' } }}
          >
            View all {commentsCount} comments
          </Typography>
        </Box>
      )}

      {/* ── Comments Section ── */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider sx={{ borderColor: '#2d3748' }} />
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          {loadingComments ? (
            <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>Loading…</Typography>
          ) : comments.length === 0 ? (
            <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>No comments yet.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
              {comments.map(comment => (
                <Comment key={comment.id} comment={comment} onDelete={handleDeleteComment} />
              ))}
            </Box>
          )}

          {/* Add comment input */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1, borderTop: '1px solid #2d3748' }}>
            <Avatar
              src={user?.avatar_url || ''}
              sx={{ width: 28, height: 28, backgroundColor: '#ff9500', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}
            >
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              placeholder="Add a comment…"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
              InputProps={{
                disableUnderline: true,
                sx: { color: '#f1f5f9', fontSize: '0.875rem' },
              }}
              sx={{ '& .MuiInput-input::placeholder': { color: '#64748b', opacity: 1 } }}
            />
            {newComment.trim() && (
              <Typography
                onClick={handleAddComment}
                sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#ff9500', cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { color: '#ffb74d' } }}
              >
                Post
              </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
