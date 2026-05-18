'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF9800', // Orange accent
      light: '#FFB74D',
      dark: '#F57C00',
    },
    secondary: {
      main: '#9ca3af', // Clean gray
    },
    background: {
      default: '#121212', // Deep dark background
      paper: '#161616', // Slightly lighter dark for cards
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0aec0',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
        },
        contained: {
          backgroundColor: '#FF9800',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#F57C00',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161616',
          border: '1px solid #2d2d2d',
          borderRadius: '12px',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2d2d2d',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: '#2d2d2d',
            },
            '&:hover fieldset': {
              borderColor: '#404040',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF9800',
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#2d2d2d #121212',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#121212',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#2d2d2d',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#404040',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#404040',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#404040',
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#121212',
          },
        },
      },
    },
  },
});

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppLayout>
          {children}
        </AppLayout>
      </AuthProvider>
    </ThemeProvider>
  );
}
