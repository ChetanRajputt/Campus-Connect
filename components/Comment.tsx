'use client';

// components/Comment.tsx
// यह component एक single comment को display करता है
// This component displays a single comment

import { Box, Typography, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Comment as CommentType, User } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

interface CommentProps {
  comment: CommentType & { users?: User };
  onDelete: (commentId: string) => void;
}

export default function Comment({ comment, onDelete }: CommentProps) {
  const { user, isAdmin } = useAuth();

  return (
    <Box sx={{ display: 'flex', gap: 1, p: 1.5, mb: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #2d2d2d', borderRadius: 2 }}>
      <Avatar
        src={comment.users?.avatar_url || ''}
        sx={{ width: 32, height: 32, backgroundColor: '#2d2d2d' }}
      >
        {comment.users?.full_name?.[0] || 'U'}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#fff' }}>
          {comment.users?.full_name || 'Anonymous'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#e2e8f0', mt: 0.5 }}>{comment.content}</Typography>
        <Typography variant="caption" sx={{ color: '#a0aec0', display: 'block', mt: 0.5 }}>
          {new Date(comment.created_at).toLocaleString('en-IN')}
        </Typography>
      </Box>
      {(user?.id === comment.user_id || isAdmin) && (
        <IconButton
          size="small"
          sx={{ color: '#ef4444' }}
          onClick={() => onDelete(comment.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
