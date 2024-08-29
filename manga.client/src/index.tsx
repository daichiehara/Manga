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
import { NotificationProvider } from './components/context/NotificationContext';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { SERVICE_NAME } from './serviceName';
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - 日本初の漫画の物々交換サービス</title>
        {/*  <meta name="description" content={`${SERVICE_NAME}は日本初の漫画の物々交換を簡単に楽しめるサービスです。`} /> */}
        <meta property="og:title" content={`${SERVICE_NAME} - 日本初の漫画の物々交換サービス`} />
        <meta property="og:description" content={`${SERVICE_NAME}は日本初の漫画の物々交換を簡単に楽しめるサービスです。`} /> 
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content="https://tocaeru.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - 日本初の漫画の物々交換サービス`} />
        <meta name="twitter:description" content={`${SERVICE_NAME}は日本初の漫画の物々交換を簡単に楽しめるサービスです。`} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>

        <ThemeProvider theme={theme}>
          <AuthProvider>
            <AppProvider>
              <UserProvider>
                <NotificationProvider>
                  <BooksProvider>
                    <SnackbarProvider>
                      <GoogleReCaptchaProvider reCaptchaKey="6LdZuzEqAAAAAI41GSJIVRqDA4y8jiyQvM-WQVPw">
                        <App />
                      </GoogleReCaptchaProvider>
                    </SnackbarProvider>
                  </BooksProvider>
                </NotificationProvider>
              </UserProvider>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
