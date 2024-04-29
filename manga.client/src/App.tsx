import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import { Box } from '@mui/material';
import MainSearch from './pages/MainSearch';
import MangaDetail from './pages/MangaDetail';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import MainNotification from './pages/MainNotification';
import MainMyBook from './pages/MainMyBook';
import MSell from './pages/MSell.tsx';
import MainMyPage from './pages/MainMyPage';
import LoginPage from './pages/LoginPage';
import MpFavoList from './pages/MpFavoList.tsx';
import TestRefreshToken from './pages/TestRefreshToken.tsx';
import { authService } from './api/authService.ts';
import MpChangeEmailPassword from './pages/MpChangeEmailPassword.tsx';
import MpAdressUpadate from './pages/MpAdressUpdate.tsx';
import MpMySell from './pages/MpMySell.tsx';
import MpMatchedSell from './pages/MpMatchedSell.tsx';
import MpIdVerification from './pages/MpIdVerification.tsx';
import IdCamera from './pages/IdCamera.tsx';


const App = () => {
  useEffect(() => {
    // アプリケーションの起動時に一度だけリフレッシュトークンのロジックを実行する
    authService.refreshToken();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      {/* 全体を囲むBoxコンポーネント */}
      <Box sx={{
        minHeight: '100vh', // 画面の最小高さ
        //backgroundColor: '#FCFCFC', // 背景色をグレーに設定
        boxShadow: '2px 0 4px -2px rgba(0, 0, 0, 0.2), -2px 0 4px -2px rgba(0, 0, 0, 0.2)' 
      }}>
        <Router>
          <Routes>
            <Route path="/item/favorite" element={<MainSearch initialTab={0} />} />
            <Route path="/" element={<MainSearch initialTab={1} />} />
            <Route path="/item/new" element={<MainSearch initialTab={2} />} />
            <Route path="/item/:sellId" element={<MangaDetail />} />
            <Route path="/main-notification" element={<MainNotification />} /> {/* 通知ページのルート */}
            <Route path="/main-mybook" element={<MainMyBook />} /> {/* マイ本棚のルート */}
            <Route path="/main-sell" element={<MSell />} />
            <Route path="/main-page" element={<MainMyPage />} /> {/* マイページのルート */}
            <Route path="/login-page" element={<LoginPage />} /> {/* ログインページのルート */}
            <Route path="/test" element={<TestRefreshToken />} /> {/* test */}
            <Route path="/mpfavolist" element={<MpFavoList />} /> {/* test */}
            <Route path="/mpchangeemailpassword" element={<MpChangeEmailPassword />} />
            <Route path="/mpadressupdate" element={<MpAdressUpadate />} />
            <Route path="/mpmysell" element={<MpMySell />} />
            <Route path="/mpmatchedsell" element={<MpMatchedSell />} />
            <Route path="/user/verification" element={<MpIdVerification />} />
            <Route path="/user/verification/camera" element={<IdCamera />} />
            {/* 他のルートをここに追加 */}
          </Routes>
        </Router>
        
      </Box>
    </ThemeProvider>
  );
};

export default App;