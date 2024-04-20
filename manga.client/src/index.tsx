// index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme/theme';
import { AuthProvider } from './components/context/AuthContext';
import { BooksProvider } from './components/context/BookContext';
import './utils/http'


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BooksProvider>
          <App />
          </BooksProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);



