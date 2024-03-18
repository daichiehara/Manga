import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import MainSearch from './pages/MainSearch';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSearch />} />
        {/* 他のルートをここに追加 */}
      </Routes>
    </Router>
  );
};

export default App;