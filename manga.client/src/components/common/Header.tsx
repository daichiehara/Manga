import React, { useState, memo, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Paper, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TabsComponent from './TabsComponent';
import SearchSuggestions from './SearchSuggestions';
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
  const [query, setQuery] = useState(initialSearchQuery || '');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchPage = location.pathname === '/search';

  const handleSearch = (event: React.FormEvent) => {
    setIsSearchFocused(false);
    event.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleBack = () => {
    setIsSearchFocused(false);
    if (isSearchPage || location.pathname !== '/') {
      sessionStorage.removeItem('lastSearchQuery');
      sessionStorage.removeItem('lastSearchResults');
      sessionStorage.removeItem('lastSearchPage');
      sessionStorage.removeItem('isExchangeMode');
      sessionStorage.removeItem('onlyRecruiting');

      navigate(-1);
      onClearSearch();
      setQuery('');
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsSearchFocused(false);
  };

  useEffect(() => {
    setQuery(initialSearchQuery || '');
  }, [initialSearchQuery]);

  useEffect(() => {
    onSearchStateChange(isSearchPage || isSearchFocused);
  }, [isSearchPage, isSearchFocused, onSearchStateChange]);

  return (
    <>
      <AppBar position="fixed" sx={{
        pb: '0rem',
        background: '#E97032',
        boxShadow: 'none',
        maxWidth: '640px',
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
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
            <Paper
              component="form"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                boxShadow: 'none',
                margin: 'auto',
                borderRadius: '5px',
                position: 'relative',
              }}
              onSubmit={handleSearch}
            >
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="物々交換 - キーワードで検索"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleSearchFocus}
              />
            </Paper>
          </Box>
        </Toolbar>
        {!isSearchPage && !isSearchFocused && (
          <TabsComponent selectedTab={selectedTab} onTabChange={onTabChange} />
        )}
      </AppBar>
      {isSearchFocused && (
        <Box sx={{ 
          position: 'fixed', 
          top: '56px', // AppBarの高さ + 余白
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          maxWidth: '640px',
          height: 'calc(100vh - 56px)', // 画面の高さからAppBarの高さと余白を引く
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <SearchSuggestions
            query={query}
            onSuggestionClick={handleSuggestionClick}
          />
        </Box>
      )}
    </>
  );
};

export default memo(Header);