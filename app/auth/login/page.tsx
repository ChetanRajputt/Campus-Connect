'use client';

// app/auth/login/page.tsx
// यह login page है जहाँ users अपने account में login कर सकते हैं
// This is the login page where users can log into their accounts

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/feed');
    } catch (err: any) {
      if (err.message === 'Email not confirmed') {
        setError(
          '📧 Please verify your email address before logging in. If you are the developer, you can disable email confirmation in your Supabase Dashboard under Authentication -> Providers -> Email.'
        );
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2 },
        paddingTop: { xs: 'max(2rem, env(safe-area-inset-top))', md: '4rem' },
        paddingBottom: 'env(safe-area-inset-bottom)',
        width: '100%',
      }}
    >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <Box
          sx={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: { xs: 'clamp(1rem, 2vh, 1.5rem)', sm: '2rem', md: '2.5rem' },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                mb: 1,
              }}
            >
              🎓
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#f1f5f9',
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                mb: 0.5,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              }}
            >
              Login to your CampusConnect+ account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                '& .MuiAlert-icon': {
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                placeholder="Enter your email"
                variant="outlined"
                size="small"
                autoComplete="email"
                inputProps={{
                  autoCapitalize: 'off',
                  autoCorrect: 'off',
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
                sx={{
                  minHeight: '44px',
                  '& .MuiOutlinedInput-input': {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    padding: 'clamp(8px, 1vh, 12px)',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Enter your password"
                variant="outlined"
                size="small"
                autoComplete="current-password"
                InputLabelProps={{
                  sx: {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
                sx={{
                  minHeight: '44px',
                  '& .MuiOutlinedInput-input': {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                    padding: 'clamp(8px, 1vh, 12px)',
                  },
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: { xs: 1, md: 1.5 },
                  minHeight: '44px',
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  fontWeight: 700,
                }}
              >
                {loading ? <CircularProgress size={20} /> : '🚀 Login'}
              </Button>
            </Stack>
          </form>

          {/* Signup Link */}
          <Box
            sx={{
              mt: { xs: 2, md: 3 },
              pt: { xs: 2, md: 3 },
              borderTop: '1px solid #334155',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
              }}
            >
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                style={{
                  color: '#ff9500',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
