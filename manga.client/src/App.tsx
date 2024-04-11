import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MainSearch from './pages/MainSearch';
import MangaDetail from './pages/MangaDetail';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import MainNotification from './pages/MainNotification';
import MainMyBook from './pages/MainMyBook';
import MSell from './pages/MSell.tsx';
import MainMyPage from './pages/MainMyPage';
import LoginPage from './pages/LoginPage';
import TestRefreshToken from './pages/TestRefreshToken.tsx';
import { AuthProvider } from './components/auth/AuthContext';
import { authService } from './api/authService.ts';

const App = () => {
  useEffect(() => {
    // アプリケーションの起動時に一度だけリフレッシュトークンのロジックを実行する
    authService.refreshToken();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainSearch />} />
            <Route path="/item/:sellId" element={<MangaDetail />} />
            <Route path="/main-notification" element={<MainNotification />} /> {/* 通知ページのルート */}
            <Route path="/main-mybook" element={<MainMyBook />} /> {/* マイ本棚のルート */}
            <Route path="/main-sell" element={<MSell />} />
            <Route path="/main-page" element={<MainMyPage />} /> {/* マイページのルート */}
            <Route path="/login-page" element={<LoginPage />} /> {/* ログインページのルート */}
            <Route path="/test" element={<TestRefreshToken />} /> {/* test */}
            
            {/* 他のルートをここに追加 */}
          </Routes>
        </Router>
        </AuthProvider>
    </ThemeProvider>
  );
};

export default App;