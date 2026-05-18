'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import AppLayout from '@/components/AppLayout';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 1024,
      lg: 1280,
      xl: 1536,
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff9500',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
    divider: '#334155',
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#991b1b',
    },
    success: {
      main: '#22c55e',
      light: '#86efac',
      dark: '#166534',
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#92400e',
    },
    info: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1e40af',
    },
  },
  typography: {
    fontFamily:
      '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    h1: {
      fontSize: 'clamp(1.875rem, 5vw, 2.25rem)',
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
      lineHeight: 1.6,
      letterSpacing: '0.5px',
    },
    body2: {
      fontSize: 'clamp(0.8125rem, 0.9vw, 0.875rem)',
      lineHeight: 1.5,
      color: '#cbd5e1',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: 'clamp(0.875rem, 1vw, 1rem)',
      letterSpacing: '0.5px',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#94a3b8',
    },
    overline: {
      fontSize: '0.625rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0f172a',
          scrollbarColor: '#475569 #1e293b',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1e293b',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#475569',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#64748b',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: 'clamp(0.5rem, 1vw, 0.75rem) clamp(1rem, 2vw, 1.25rem)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          backgroundColor: '#ff9500',
          color: '#0f172a',
          '&:hover': {
            backgroundColor: '#f59e0b',
            boxShadow: '0 4px 12px rgba(255, 149, 0, 0.4)',
          },
          '&:disabled': {
            backgroundColor: '#475569',
            color: '#94a3b8',
          },
        },
        outlined: {
          borderColor: '#475569',
          '&:hover': {
            borderColor: '#64748b',
            backgroundColor: 'rgba(255, 149, 0, 0.05)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
          },
        },
        sizeLarge: {
          padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
          fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
        },
        sizeSmall: {
          padding: 'clamp(0.25rem, 0.5vw, 0.5rem) clamp(0.75rem, 1.5vw, 1rem)',
          fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          backgroundImage: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            borderColor: '#475569',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          transition: 'all 0.2s ease',
        },
        elevation0: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#0f172a',
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: '#334155',
            },
            '&:hover fieldset': {
              borderColor: '#475569',
            },
            '&.Mui-focused': {
              backgroundColor: '#0f172a',
              '& fieldset': {
                borderColor: '#ff9500',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputBase-input': {
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            padding: 'clamp(0.75rem, 1vw, 1rem)',
          },
          '& .MuiInputLabel-root': {
            fontSize: 'clamp(0.875rem, 1vw, 1rem)',
            '&.Mui-focused': {
              color: '#ff9500',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: 'clamp(0.875rem, 1vw, 1rem)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
          height: 'auto',
          padding: '4px 8px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#475569',
          fontSize: 'clamp(0.75rem, 1vw, 1rem)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          borderTop: '1px solid #334155',
          '& .MuiTouchRipple-root': {
            display: 'none',
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          fontSize: 'clamp(0.65rem, 0.8vw, 0.75rem)',
          minWidth: 'auto',
          padding: 'clamp(8px, 1vw, 12px) clamp(4px, 1vw, 8px)',
          color: '#94a3b8',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            color: '#ff9500',
            '& .MuiSvgIcon-root': {
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            transition: 'font-size 0.2s ease',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 'clamp(0.5rem, 1vw, 1rem)',
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 149, 0, 0.1)',
            borderLeft: '4px solid #ff9500',
            paddingLeft: 'calc(clamp(0.5rem, 1vw, 1rem) - 4px)',
            '&:hover': {
              backgroundColor: 'rgba(255, 149, 0, 0.15)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#334155',
          height: '4px',
        },
        bar: {
          backgroundColor: '#ff9500',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '16px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          border: '1px solid #334155',
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
