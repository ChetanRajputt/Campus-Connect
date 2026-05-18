// app/page.tsx
// यह home page है जो authenticated users को feed पर redirect करता है
// This is the home page that redirects to feed for logged-in users

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.push('/feed');
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          🎓 CampusConnect+
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          अपने college के साथ connect करें! Connect with your college community!
        </Typography>
        <Typography paragraph sx={{ mb: 4 }}>
          CampusConnect+ एक college-based social media platform है जहाँ आप अपने friends के साथ posts
          share कर सकते हैं, comments दे सकते हैं, और likes दे सकते हैं।
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" size="large">
              Sign Up
            </Button>
          </Link>
          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary" size="large">
              Login
            </Button>
          </Link>
        </Stack>
      </Box>
    </Container>
  );
}
