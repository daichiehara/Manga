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

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<MainSearch />} />
          <Route path="/item/:sellId" element={<MangaDetail />} />
          {/* 他のルートをここに追加 */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;