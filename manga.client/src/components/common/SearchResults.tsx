import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, FormControlLabel, Switch, CircularProgress, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MangaListItem from '../item/MangaListItem';
import { useInView } from 'react-intersection-observer';

interface MainSearch {
  sellId: number;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: {
    title: string;
    isOwned: boolean;
  }[];
  sellImage: string;
}

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [results, setResults] = useState<MainSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isExchangeMode, setIsExchangeMode] = useState(() => {
    const storedMode = sessionStorage.getItem('isExchangeMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });
  const [onlyRecruiting, setOnlyRecruiting] = useState(() => {
    const storedOnlyRecruiting = sessionStorage.getItem('onlyRecruiting');
    return storedOnlyRecruiting ? JSON.parse(storedOnlyRecruiting) : false;
  });
  const [error, setError] = useState<string | null>(null);
  const [isChangeMode, setIsChangeMode] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(false);
  const shouldRestoreScroll = useRef(true);
  
  const fetchResults = async (currentPage: number, exchangeMode: boolean, recruitingOnly: boolean) => {
    if (!query) return;
  
    setError(null);
    try {
      setIsLoading(true);
        console.log(`Fetching results with isExchangeMode: ${exchangeMode}, onlyRecruiting: ${recruitingOnly}`);
      const endpoint = exchangeMode
        ? 'https://localhost:7103/api/Sells/SearchByTitleForExchange'
        : 'https://localhost:7103/api/Sells/SearchByWord';
  
      const response = await axios.get(endpoint, {
        params: { 
          search: query, 
          page: currentPage, 
          pageSize: 10 ,
          onlyRecruiting: recruitingOnly
        },
        withCredentials: true
      });
  
      setResults(prev => {
        const newResults = currentPage === 1 ? response.data : [...prev, ...response.data];
        sessionStorage.setItem('lastSearchResults', JSON.stringify(newResults));
        return newResults;
      });
      setHasMore(response.data.length === 10);
      setPage(currentPage + 1);
      
      sessionStorage.setItem('lastSearchQuery', query);
      sessionStorage.setItem('lastSearchPage', currentPage.toString());
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setError('検索に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
      setIsChangeMode(false);
    }
  };

  useEffect(() => {
    const storedQuery = sessionStorage.getItem('lastSearchQuery');
    const storedResults = sessionStorage.getItem('lastSearchResults');
    const storedPage = sessionStorage.getItem('lastSearchPage');
    const currentOnlyRecruiting = JSON.parse(sessionStorage.getItem('onlyRecruiting') || 'false');
  
    if (query === storedQuery && !isChangeMode && storedResults) {
      setResults(JSON.parse(storedResults));
      if (storedPage) {
        setPage(parseInt(storedPage, 10));
      }
      setIsNewSearch(false);
    } else {
      setResults([]);
      setPage(1);
      setHasMore(true);
      fetchResults(1, isExchangeMode, currentOnlyRecruiting);
      setIsNewSearch(true);
    }
  }, [query]);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '0px 0px 400px 0px'
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore && results.length >= 4) {
      console.log('inView, fetching next page');
      fetchResults(page, isExchangeMode, onlyRecruiting);
    }
  }, [inView]);

    useEffect(() => {
        console.log(`page: ${page}`);
    }, [setPage]);

    const handleExchangeModeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMode = event.target.checked;
        setIsChangeMode(true);
        setIsExchangeMode(newMode);
        sessionStorage.setItem('isExchangeMode', JSON.stringify(newMode));
        setResults([]);
        setPage(1);
        setHasMore(true);
        sessionStorage.removeItem('lastSearchPage'); // ページ情報をリセット
        fetchResults(1, newMode, onlyRecruiting);
    };

    const handleOnlyRecruitingToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMode = event.target.checked;
        console.log(`newmode: ${newMode}`);
        setOnlyRecruiting(newMode);
        sessionStorage.setItem('onlyRecruiting', JSON.stringify(newMode));
        setResults([]);
        setPage(1);
        setHasMore(true);
        fetchResults(1, isExchangeMode, newMode);
    };

    useEffect(() => {
        const storedScrollPosition = sessionStorage.getItem('searchScrollPosition');
        if (storedScrollPosition && !isNewSearch && shouldRestoreScroll.current) {
          shouldRestoreScroll.current = false;
          // スクロール位置の復元を少し遅延させる
          setTimeout(() => {
            window.scrollTo(0, parseInt(storedScrollPosition, 10));
          }, 100);
        } else if (isNewSearch) {
          window.scrollTo(0, 0);
          sessionStorage.removeItem('searchScrollPosition');
        }
      }, [isNewSearch]);
    
      // コンポーネントがアンマウントされる際にフラグをリセット
      useEffect(() => {
        return () => {
          shouldRestoreScroll.current = true;
        };
      }, []);

      useEffect(() => {
        console.log(`query: ${query}`)
      }, [query]);
    
      const handleItemClick = useCallback(() => {
        sessionStorage.setItem('searchScrollPosition', window.scrollY.toString());
      }, []);
      
  return (
    <Box sx={{ pt: 10, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, px: 2 }}>
        <FormControlLabel
        control={
            <Switch
            checked={onlyRecruiting}
            onChange={handleOnlyRecruitingToggle}
            name="onlyRecruiting"
            color="primary"
            />
        }
        label="出品中のみ"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <IconButton size="small">
                <SearchIcon />
            </IconButton>
            <Switch
                checked={isExchangeMode}
                onChange={handleExchangeModeToggle}
                name="exchangeMode"
                color="primary"
            />
            <IconButton size="small">
                <AutoStoriesIcon />
            </IconButton>
        </Box>
    </Box>

      {error && <Typography color="error">{error}</Typography>}

      {results.length === 0 && !isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Typography variant="h6">
            {isExchangeMode 
              ? `"${query}" に関連する交換可能な商品が見つかりませんでした。`
              : `"${query}" に関連する商品が見つかりませんでした。`}
          </Typography>
        </Box>
      ) : (
        results.map((item, index) => (
          <MangaListItem
            key={`${isExchangeMode ? 'exchange' : 'search'}-${item.sellId}-${index}`}
            sellId={item.sellId}
            sellImage={item.sellImage}
            sellTitle={item.sellTitle}
            numberOfBooks={item.numberOfBooks}
            wishTitles={item.wishTitles}
            onItemClick={handleItemClick}
          />
        ))
      )}
      
      <div ref={ref} style={{ height: '20px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isLoading && (
          <CircularProgress size={20} style={{ marginRight: '10px' }} />
        )}
      </div>
    </Box>
  );
};

export default SearchResults;