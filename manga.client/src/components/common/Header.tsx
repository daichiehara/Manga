import React, { useState, memo, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Paper, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TabsComponent from './TabsComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// 検索バーとタブを持つコンポーネントのPropsの型定義
interface HeaderProps {
  onSearch: (query: string) => void;
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

// 検索バーとタブコンポーネントの実装
const Header: React.FC<HeaderProps> = ({ onSearch, selectedTab, onTabChange }) => {
  const [query, setQuery] = useState('');  // 検索クエリのローカルステート
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';
  const showBackButton = isSearchPage || isSearchFocused;

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  useEffect(() => {
    if (!isSearchPage) {
      setIsSearchFocused(false);
    }
  }, [isSearchPage]);

  const handleSearchBlur = () => {
    // オプション: ブラー時にフォーカス状態を解除する場合はコメントを外す
    // setIsSearchFocused(false);
  };
  
  return (
    <AppBar position="fixed" sx={{
      pb: '0rem',
      background: '#53A422',
      boxShadow: 'none',
      maxWidth: '640px',
      width: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      <Toolbar disableGutters sx={{ width: 'auto', mt: '1rem', mb: 0, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBack}
              aria-label="back"
              sx={{ mr: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Paper component="form" sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            boxShadow: 'none',
            margin: 'auto',
            borderRadius: '5px'
          }} onSubmit={handleSearch}>
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Tocaeru.comで検索"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </Paper>
        </Box>
      </Toolbar>
      {!showBackButton && (
        <TabsComponent selectedTab={selectedTab} onTabChange={onTabChange} />
      )}
    </AppBar>
  );
};

// パフォーマンス最適化のためにReact.memoでコンポーネントをラップ
export default memo(Header);
