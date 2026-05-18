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
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: { xs: 1, sm: 1.5 },
        mb: 1,
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#475569',
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
        },
      }}
    >
      <Avatar
        src={comment.users?.avatar_url || ''}
        sx={{
          width: { xs: 28, sm: 32 },
          height: { xs: 28, sm: 32 },
          backgroundColor: '#ff9500',
          fontWeight: 700,
          fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
          flexShrink: 0,
        }}
      >
        {comment.users?.full_name?.[0]?.toUpperCase() ||
          comment.users?.email?.[0]?.toUpperCase() ||
          'U'}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
          }}
        >
          {comment.users?.full_name || 'Anonymous'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#cbd5e1',
            mt: 0.5,
            fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {comment.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: '#94a3b8',
            display: 'block',
            mt: 0.5,
            fontSize: 'clamp(0.65rem, 0.75vw, 0.7rem)',
          }}
        >
          {new Date(comment.created_at).toLocaleString('en-IN')}
        </Typography>
      </Box>
      {(user?.id === comment.user_id || isAdmin) && (
        <IconButton
          size="small"
          sx={{
            color: '#ef4444',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
            },
          }}
          onClick={() => onDelete(comment.id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}
