import React, { useState, memo, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Paper, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TabsComponent from './TabsComponent';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderProps {
  onSearch: (query: string) => void;
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  initialSearchQuery: string;
  onClearSearch: () => void;
  onSearchStateChange: (isSearchActive: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, selectedTab, onTabChange, initialSearchQuery, onClearSearch, onSearchStateChange }) => {
  const [query, setQuery] = useState(initialSearchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleBack = () => {
    if (isSearchPage || location.pathname !== '/') {
      sessionStorage.removeItem('lastSearchQuery');
      sessionStorage.removeItem('lastSearchResults');
      sessionStorage.removeItem('lastSearchPage');
      sessionStorage.removeItem('isExchangeMode');

      navigate(-1);
      onClearSearch();  // 検索結果をクリア
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  useEffect(() => {
    setQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    onSearchStateChange(isSearchPage || isSearchFocused);
  }, [isSearchPage, isSearchFocused, onSearchStateChange]);
  
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
          {(isSearchPage || isSearchFocused) && (
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
      {!isSearchPage && !isSearchFocused && (
        <TabsComponent selectedTab={selectedTab} onTabChange={onTabChange} />
      )}
    </AppBar>
  );
};

export default memo(Header);