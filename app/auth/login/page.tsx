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
        setError('📧 Please verify your email address before logging in. If you are the developer, you can disable email confirmation in your Supabase Dashboard under Authentication -> Providers -> Email.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              placeholder="आपका email दर्ज करें"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              placeholder="आपका password दर्ज करें"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Stack>
        </form>

        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          Account नहीं है?{' '}
          <Link href="/auth/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
            Sign Up करें
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
