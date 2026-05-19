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
          Connect with your college community!
        </Typography>
        <Typography paragraph sx={{ mb: 4 }}>
          CampusConnect+ is a college-based social media platform where you can share posts,
          comment, and like content with your friends.
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
