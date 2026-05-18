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
    <Box sx={{ background: '#0f0f1e', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          sx={{
            background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.9) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(168, 85, 247, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              mb: 1,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🎓 Join CampusConnect+
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              color: '#a0aec0'
            }}
          >
            Connect with your college community
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignUp}>
            <Stack spacing={2.5}>
              <TextField
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                fullWidth
                required
                placeholder="अपना नाम दर्ज करें"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    '& fieldset': { borderColor: 'rgba(168, 85, 247, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(168, 85, 247, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: '#666', opacity: 0.7 },
                }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                placeholder="आपका email दर्ज करें"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    '& fieldset': { borderColor: 'rgba(168, 85, 247, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(168, 85, 247, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: '#666', opacity: 0.7 },
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Strong password चुनें"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    '& fieldset': { borderColor: 'rgba(168, 85, 247, 0.2)' },
                    '&:hover fieldset': { borderColor: 'rgba(168, 85, 247, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                  },
                  '& .MuiOutlinedInput-input::placeholder': { color: '#666', opacity: 0.7 },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  mt: 1,
                  fontWeight: 700,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #9333ea, #db2777)',
                  },
                  '&:disabled': { opacity: 0.5 },
                }}
              >
                {loading ? <CircularProgress size={24} /> : '✨ Create Account'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <Typography variant="body2" sx={{ textAlign: 'center', color: '#a0aec0', mb: 2 }}>
              पहले से account है?{' '}
              <Link href="/auth/login" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600 }}>
                Login करें
              </Link>
            </Typography>

            <Alert 
              severity="info"
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#93c5fd',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: '0.85rem',
              }}
            >
              💡 <strong>Note:</strong> Email verification may take a moment. Check spam folder if needed.
            </Alert>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
