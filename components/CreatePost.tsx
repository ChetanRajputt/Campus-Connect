'use client';

// components/CreatePost.tsx
// यह component नया post create करने के लिए है
// This component allows users to create new posts

import { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Avatar,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, isAdmin } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('posts-images')
      .upload(`posts/${fileName}`, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('posts-images')
      .getPublicUrl(`posts/${fileName}`);

    return publicUrl.publicUrl;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setError('');
    setLoading(true);

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const { error: insertError } = await supabase.from('posts').insert({
        user_id: user.id,
        title: title || null,
        content,
        image_url: imageUrl,
        is_announcement: isAdmin ? isAnnouncement : false,
      });

      if (insertError) throw insertError;

      // Reset form
      setContent('');
      setTitle('');
      setSelectedFile(null);
      setPreviewUrl('');
      setIsAnnouncement(false);
      onPostCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: { xs: 2, md: 3 },
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#475569',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
              '& .MuiAlert-icon': {
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleCreatePost}>
          {/* Header with Avatar */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar
              src={user?.avatar_url || ''}
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                backgroundColor: '#ff9500',
                fontWeight: 700,
                fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                flexShrink: 0,
              }}
            >
              {user?.full_name?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              {title && (
                <TextField
                  fullWidth
                  placeholder="Title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  variant="standard"
                  sx={{
                    mb: 1,
                    '& .MuiInput-underline:before': {
                      borderBottomColor: '#334155',
                    },
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#475569',
                    },
                    '& .MuiInput-underline:after': {
                      borderBottomColor: '#ff9500',
                    },
                  }}
                  InputProps={{
                    sx: {
                      color: '#f1f5f9',
                      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                      fontWeight: 600,
                    },
                  }}
                />
              )}
              <TextField
                fullWidth
                placeholder="What's on your mind?"
                multiline
                minRows={3}
                maxRows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: '#f1f5f9',
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    lineHeight: 1.6,
                  },
                }}
                sx={{
                  '& .MuiInput-input': {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Image Preview */}
          {previewUrl && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxHeight: 300,
                mb: 2,
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #334155',
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Button
                size="small"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                Remove
              </Button>
            </Box>
          )}

          {/* Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'center', sm: 'center' },
              borderTop: '1px solid #334155',
              pt: 2,
              gap: 1,
              flexWrap: 'wrap',
              flexDirection: { xs: 'column-reverse', sm: 'row' },
            }}
          >
            {/* Left Actions */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                order: { xs: 2, sm: 1 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Button
                component="label"
                startIcon={<ImageIcon />}
                size="small"
                sx={{
                  color: '#94a3b8',
                  fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 149, 0, 0.1)',
                    color: '#f1f5f9',
                  },
                }}
              >
                Media
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </Button>

              {isAdmin && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAnnouncement}
                      onChange={(e) => setIsAnnouncement(e.target.checked)}
                      size="small"
                      sx={{
                        color: '#94a3b8',
                        '&.Mui-checked': {
                          color: '#ff9500',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: '#94a3b8', fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)' }}>
                      Announcement
                    </Typography>
                  }
                />
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={!content.trim() || loading}
              sx={{
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' },
                minHeight: '40px',
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                'Post'
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
