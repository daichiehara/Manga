// index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme/theme';
import { AuthProvider } from './components/context/AuthContext';
import { BooksProvider } from './components/context/BookContext';
import { SnackbarProvider } from './components/context/SnackbarContext';
import { UserProvider } from './components/context/UserContext';
import { AppProvider } from './components/context/AppContext';
import './utils/http'


const container = document.getElementById('root');

// containerがnullでないことを確認
if (container) {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AuthProvider>
        <UserProvider>
          <AppProvider>
            <BooksProvider>
              <SnackbarProvider>
                <App />
              </SnackbarProvider>
            </BooksProvider>
          </AppProvider>
        </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}


