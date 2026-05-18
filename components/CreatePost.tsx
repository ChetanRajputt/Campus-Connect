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
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { supabase } from '@/utils/supabase';
import { useAuth } from '@/context/AuthContext';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
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
      });

      if (insertError) throw insertError;

      // Reset form
      setContent('');
      setTitle('');
      setSelectedFile(null);
      setPreviewUrl('');
      onPostCreated?.();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ 
      mb: 3,
      backgroundColor: '#161616',
      border: '1px solid #2d2d2d',
      borderRadius: '12px',
    }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleCreatePost}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Avatar 
              src={user?.avatar_url || ''} 
              sx={{ width: 40, height: 40, backgroundColor: '#2d2d2d' }}
            >
              {user?.full_name?.[0] || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                placeholder="What's on your mind?"
                multiline
                minRows={1}
                maxRows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { color: '#fff', fontSize: '1rem' }
                }}
              />
            </Box>
          </Box>

          {previewUrl && (
            <Box
              component="img"
              src={previewUrl}
              sx={{ 
                width: '100%', 
                maxHeight: 300, 
                objectFit: 'cover', 
                borderRadius: '8px', 
                mb: 2,
                border: '1px solid #2d2d2d',
              }}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #2d2d2d', pt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component="label"
                startIcon={<ImageIcon />}
                sx={{
                  color: '#a0aec0',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#fff' }
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
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={!content.trim() || loading}
              sx={{
                backgroundColor: '#FF9800',
                color: '#000',
                borderRadius: '20px',
                px: 3,
                fontWeight: 700,
                '&:hover': { backgroundColor: '#F57C00' },
                '&:disabled': { backgroundColor: '#333', color: '#666' }
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'Post'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
