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
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0f172a', pb: { xs: 8, md: 4 } }}>
        {/* Banner Section */}
        <Box
          sx={{
            height: { xs: 150, sm: 200, md: 250 },
            width: '100%',
            backgroundColor: '#1e293b',
            backgroundImage: bannerFile
              ? `url(${URL.createObjectURL(bannerFile)})`
              : (user as any)?.banner_url
                ? `url(${(user as any).banner_url})`
                : 'linear-gradient(135deg, #ff9500 0%, #f57c00 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            borderBottom: '1px solid #334155',
          }}
        >
          <Button
            component="label"
            sx={{
              position: 'absolute',
              bottom: { xs: 8, md: 16 },
              right: { xs: 8, md: 16 },
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            }}
          >
            📷 Edit Cover
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && setBannerFile(e.target.files[0])
              }
            />
          </Button>
        </Box>

        <Container
          maxWidth="md"
          sx={{ px: { xs: 1, sm: 2, md: 3 }, py: { xs: 2, md: 4 } }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              mt: { xs: -10, sm: -14, md: -20 },
              mb: { xs: 2, md: 4 },
              gap: { xs: 2, md: 4 },
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : user?.avatar_url || ''
                }
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  border: '4px solid #0f172a',
                  backgroundColor: '#ff9500',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                }}
              >
                {user?.full_name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  'U'}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#ff9500',
                  color: '#0f172a',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f59e0b',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Typography sx={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.25rem)' }}>
                  📷
                </Typography>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setAvatarFile(e.target.files[0])
                  }
                />
              </IconButton>
            </Box>

            {/* Save Button */}
            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
              sx={{
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                py: { xs: 1, sm: 1.5 },
                px: { xs: 2, sm: 3 },
              }}
            >
              {loading ? <CircularProgress size={20} /> : 'Save Profile'}
            </Button>
          </Box>

          {/* User Info */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#f1f5f9',
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                mb: 0.5,
              }}
            >
              {user?.full_name || 'User Name'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                mb: 2,
              }}
            >
              @{user?.email?.split('@')[0] || 'user'}
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#fca5a5',
                  fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#86efac',
                  fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
                }}
              >
                {success}
              </Alert>
            )}
          </Box>

          {/* Profile Form */}
          <Box
            sx={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              p: { xs: 2, sm: 3, md: 4 },
              transition: 'all 0.2s ease',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: { xs: 2, md: 3 },
                borderBottom: '1px solid #334155',
                pb: 2,
                fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                color: '#f1f5f9',
              }}
            >
              Profile Details
            </Typography>

            <form onSubmit={handleUpdateProfile}>
              <Stack spacing={{ xs: 2, md: 3 }}>
                {/* Full Name */}
                <TextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    },
                  }}
                />

                {/* Bio */}
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  variant="outlined"
                  size="small"
                  InputLabelProps={{
                    sx: {
                      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    },
                  }}
                />

                {/* College, Department, Roll Number */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: { xs: 2, md: 3 },
                  }}
                >
                  <TextField
                    fullWidth
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      sx: {
                        fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      sx: {
                        fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Roll Number"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    InputLabelProps={{
                      sx: {
                        fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                      },
                    }}
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
