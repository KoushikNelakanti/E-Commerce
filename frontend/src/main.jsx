import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SnackbarProvider } from './context/SnackbarContext.jsx';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import darkTheme from './theme-dark';
import { useDarkMode } from './context/DarkModeContext';

// Create a component that provides the correct theme based on dark mode context
const ThemedApp = () => {
  const { isDarkMode } = useDarkMode();
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : theme}>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <SnackbarProvider>
        <ThemedApp />
      </SnackbarProvider>
    </DarkModeProvider>
  </React.StrictMode>
);