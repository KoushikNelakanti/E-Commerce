import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a84ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff9f0a',
    },
    background: {
      default: '#000000',
      paper: '#1c1c1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ebebf5',
      disabled: '#ebebf599',
    },
    divider: 'rgba(56, 56, 58, 1)',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

export default darkTheme;