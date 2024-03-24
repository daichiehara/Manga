import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MainSearch from './pages/MainSearch';
import MangaDetail from './pages/MangaDetail';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSearch />} />
        <Route path="/manga/:sellId" element={<MangaDetail />} />
        {/* 他のルートをここに追加 */}
      </Routes>
    </Router>
  );
};

export default App;