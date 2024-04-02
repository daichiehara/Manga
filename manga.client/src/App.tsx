import React from 'react';
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
import MainSell from './pages/MSell.tsx';
import MainMyPage from './pages/MainMyPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainSearch />} />
          <Route path="/item/:sellId" element={<MangaDetail />} />
          <Route path="/main-notification" element={<MainNotification />} /> {/* 通知ページのルート */}
          <Route path="/main-mybook" element={<MainMyBook />} /> {/* マイ本棚のルート */}
          <Route path="/main-sell" element={<MainSell />} /> {/* マイ本棚のルート */}
          <Route path="/main-page" element={<MainMyPage />} /> {/* マイページのルート */}
          {/* 他のルートをここに追加 */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;