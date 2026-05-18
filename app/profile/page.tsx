'use client';

// app/profile/page.tsx
// यह profile page है जहाँ user अपनी profile information edit कर सकता है
// This is the profile page where users can view and edit their profile

import { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Avatar, Stack, Typography, Alert, CircularProgress, IconButton } from '@mui/material';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    roll_number: '',
    college: '',
    department: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        bio: user.bio || '',
        roll_number: user.roll_number || '',
        college: user.college || '',
        department: user.department || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File, pathPrefix: string) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${pathPrefix}/${fileName}`, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${pathPrefix}/${fileName}`);

    return data.publicUrl;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let avatarUrl = user.avatar_url;
      let bannerUrl = (user as any).banner_url;

      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile, 'profiles');
      }
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }

      const updates = {
        ...formData,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      };

      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully! ✅');
      setTimeout(() => setSuccess(''), 3000);
      
      // Update local state by forcing a refresh or you can update Context
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', pb: 8 }}>
        {/* Banner Section */}
        <Box 
          sx={{ 
            height: 250, 
            width: '100%', 
            backgroundColor: '#1a1a1a',
            backgroundImage: (bannerFile ? `url(${URL.createObjectURL(bannerFile)})` : (user as any)?.banner_url ? `url(${(user as any).banner_url})` : 'none'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            borderBottom: '1px solid #2d2d2d'
          }}
        >
          <Button
            component="label"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' }
            }}
          >
            📷 Edit Cover
            <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && setBannerFile(e.target.files[0])} />
          </Button>
        </Box>

        <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -8, mb: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar_url || ''}
                sx={{ 
                  width: 140, 
                  height: 140, 
                  border: '4px solid #121212',
                  backgroundColor: '#2d2d2d',
                  fontSize: '3rem',
                  fontWeight: 700
                }}
              >
                {user?.full_name?.[0] || 'U'}
              </Avatar>
              <IconButton 
                component="label"
                sx={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  right: 8, 
                  backgroundColor: '#FF9800', 
                  color: '#000',
                  '&:hover': { backgroundColor: '#F57C00' },
                  width: 36,
                  height: 36,
                }}
              >
                <Typography sx={{ fontSize: '1.2rem' }}>📷</Typography>
                <input type="file" hidden accept="image/*" onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])} />
              </IconButton>
            </Box>
            
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
              sx={{
                backgroundColor: '#FF9800',
                color: '#000',
                fontWeight: 700,
                borderRadius: '20px',
                px: 4,
                '&:hover': { backgroundColor: '#F57C00' },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Save Profile'}
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
              {user?.full_name || 'User Name'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#a0aec0', mb: 2 }}>
              @{user?.email?.split('@')[0]}
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>{success}</Alert>}
          </Box>

          <Box sx={{ 
            backgroundColor: '#161616', 
            border: '1px solid #2d2d2d', 
            borderRadius: '12px', 
            p: 4 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, borderBottom: '1px solid #2d2d2d', pb: 1 }}>
              Profile Details
            </Typography>
            <form onSubmit={handleUpdateProfile}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  InputLabelProps={{ style: { color: '#a0aec0' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  InputLabelProps={{ style: { color: '#a0aec0' } }}
                  InputProps={{ style: { color: '#fff' } }}
                />

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <TextField
                    fullWidth
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    InputLabelProps={{ style: { color: '#a0aec0' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    InputLabelProps={{ style: { color: '#a0aec0' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  />
                  <TextField
                    fullWidth
                    label="Roll Number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    InputLabelProps={{ style: { color: '#a0aec0' } }}
                    InputProps={{ style: { color: '#fff' } }}
                  />
                </Box>
              </Stack>
            </form>
          </Box>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
