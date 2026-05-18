'use client';

// app/auth/signup/page.tsx
// यह signup page है जहाँ नए users account बना सकते हैं
// This is the signup page where new users can create accounts

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
  Paper,
} from '@mui/material';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName);
      router.push('/feed');
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      
      // Better error messages
      if (errorMessage.includes('rate limit') || errorMessage.includes('Too many requests')) {
        setError('⏱️ Email rate limit reached. Please try again in an hour or use the test login.');
      } else if (errorMessage.includes('User already registered')) {
        setError('📧 This email is already registered. Try logging in instead.');
      } else if (errorMessage.includes('invalid email')) {
        setError('❌ Please enter a valid email address.');
      } else {
        setError(errorMessage);
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
      }}
    >
      <Container maxWidth="sm" sx={{ width: '100%' }}>
        <Box
          sx={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                fontSize: 'clamp(2.5rem, 4vw, 3rem)',
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
                background: 'linear-gradient(135deg, #ff9500, #f59e0b)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                mb: 0.5,
              }}
            >
              Join CampusConnect+
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: 'clamp(0.875rem, 1vw, 1rem)',
              }}
            >
              Connect with your college community
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
          <form onSubmit={handleSignUp}>
            <Stack spacing={{ xs: 1.5, md: 2 }}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                required
                placeholder="Enter your full name"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-input::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                placeholder="Enter your college email"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
                sx={{
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
                placeholder="Create a strong password"
                variant="outlined"
                size="small"
                InputLabelProps={{
                  sx: {
                    fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  },
                }}
                sx={{
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
                  fontSize: 'clamp(0.875rem, 1vw, 1rem)',
                  fontWeight: 700,
                }}
              >
                {loading ? <CircularProgress size={20} /> : '✨ Create Account'}
              </Button>
            </Stack>
          </form>

          {/* Login Link */}
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
              Already have an account?{' '}
              <Link
                href="/auth/login"
                style={{
                  color: '#ff9500',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
}
