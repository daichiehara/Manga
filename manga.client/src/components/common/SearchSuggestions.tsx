import React, { useState, useEffect, useCallback } from 'react';
import { List, ListItemButton, ListItemText, Paper, Box, Typography, Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

interface Suggestion {
  result: string;
  isExactAuthorMatch: boolean;
}

const popularQueries = ["ワンピース", "鬼滅の刃", "呪術廻戦", "進撃の巨人", "ドラゴンボール"];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSuggestionClick }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isExchangeMode, setIsExchangeMode] = useState(() => {
    const storedMode = sessionStorage.getItem('isExchangeMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    console.log('Fetching suggestions for:', searchQuery);

    try {
      const response = await axios.get('https://localhost:7103/api/Sells/All', {
        params: { query: searchQuery },
      });
      console.log('API response:', response.data);
      
      const formattedSuggestions: Suggestion[] = response.data.map((result: string) => ({
        result,
        isExactAuthorMatch: false
      }));
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('検索候補の取得中にエラーが発生しました:', error);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, fetchSuggestions]);

  const handleModeChange = (mode: boolean) => {
    setIsExchangeMode(mode);
    sessionStorage.setItem('isExchangeMode', JSON.stringify(mode));
  };

  return (
    <Box sx={{ 
      maxWidth: '640px', 
      width: '100%', 
      height: '100%',
    }}>
      <Paper elevation={3} sx={{ 
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        padding: 2,
        boxSizing: 'border-box'
      }}>
        {query.length === 0 || suggestions.length === 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => handleModeChange(false)}
                sx={{
                  width: '48%',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textTransform: 'none',
                  padding: '10px',
                  backgroundColor: isExchangeMode ? 'white' : '#FFF0E6',
                  color: '#E97032',
                  borderColor: isExchangeMode ? 'text.secondary' : '#E97032',
                  '&:hover': {
                    backgroundColor: isExchangeMode ? '#FFF0E6' : '#FFE4D1',
                    borderColor: '#E97032',
                  },
                }}
              >
                <Typography variant="body2" color={isExchangeMode ? 'text.secondary' : 'inherit'}>
                  欲しい漫画を検索
                </Typography>
                <SearchIcon sx={{ fontSize: 40, color: isExchangeMode ? 'text.secondary' : 'inherit' }} />
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleModeChange(true)}
                sx={{
                  width: '48%',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textTransform: 'none',
                  padding: '10px',
                  backgroundColor: isExchangeMode ? '#FFF0E6' : 'white',
                  color: '#E97032',
                  borderColor: isExchangeMode ? '#E97032' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: isExchangeMode ? '#FFE4D1' : '#FFF0E6',
                    borderColor: '#E97032',
                  },
                }}
              >
                <Typography variant="body2" color={isExchangeMode ? 'inherit' : 'text.secondary'}>
                  持っている漫画から検索
                </Typography>
                <AutoStoriesIcon sx={{ fontSize: 40, color: isExchangeMode ? 'inherit' : 'text.secondary' }} />
              </Button>
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              {isExchangeMode 
                ? "持っている漫画のタイトルを入力して、交換可能な出品を探しましょう。" 
                : "欲しい漫画のタイトルを入力して、検索を開始しましょう。"}
            </Typography>
            <Divider sx={{ my: 6 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', }}>
              検索候補
            </Typography>
            <List>
              {popularQueries.map((popularQuery, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => onSuggestionClick(popularQuery)}
                  sx={{
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#FFF0E6',
                    },
                  }}
                >
                  <ListItemText primary={popularQuery} />
                </ListItemButton>
              ))}
            </List>
          </>
        ) : (
          <List sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            '&::-webkit-scrollbar': {
              width: '0.4em'
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
              outline: '1px solid slategrey'
            }
          }}>
            {suggestions.map((suggestion, index) => (
              <ListItemButton
                key={index}
                onClick={() => onSuggestionClick(suggestion.result)}
              >
                <ListItemText 
                  primary={suggestion.result}
                  secondary={suggestion.isExactAuthorMatch ? '著者' : null}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default SearchSuggestions;