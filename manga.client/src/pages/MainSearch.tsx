import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import TabsComponent from '../components/common/TabsComponent';
import MangaListItem from '../components/item/MangaListItem';
import Header from '../components/common/Header';
//import MangaImage1 from '../assets/images/MangaImage1.jpg';
import MenuBar from '../components/menu/MenuBar';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { AppContext } from '../components/context/AppContext';
import { AuthContext } from '../components/context/AuthContext';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

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

interface MainSearchProps {
  initialTab: number;
}

const MainSearch: React.FC<MainSearchProps> = ({initialTab = 1}) => {
  const { 
    mangaData, 
    myListData, 
    recommendData, 
    isLoadingManga, 
    isLoadingMyList, 
    isLoadingRecommend, 
    error,
    fetchMoreData,
    hasMore,
  } = useContext(AppContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const isCurrentTabHasMore = hasMore[selectedTab];
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '0px 0px 400px 0px' // 画面下端から200px手前で発火
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<MainSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
  const [isExchangeMode, setIsExchangeMode] = useState(false);
  const [exchangeResults, setExchangeResults] = useState<MainSearch[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inView && hasMore) {
        console.log('Fetching more data');
        fetchMoreData(selectedTab);
      }
    }, 200); // 200ms の遅延
  
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    console.log('inView changed:', inView);
  }, [inView]);
  
  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setCurrentSearchQuery(query);
    try {
      const response = await axios.get('https://localhost:7103/api/Sells/SearchByWord', {
        params: { search: query },
        withCredentials: true
      });
      setSearchResults(response.data);
      setSearchError(null);
    } catch (error) {
      console.error('検索中にエラーが発生しました:', error);
      setSearchError('検索に失敗しました。もう一度お試しください。');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleExchangeSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const response = await axios.get('https://localhost:7103/api/Sells/SearchByTitleForExchange', {
        params: { title: query },
        withCredentials: true
      });
      setSearchResults(response.data);
      setSearchError(null);
    } catch (error) {
      console.error('交換モードでの検索中にエラーが発生しました:', error);
      setSearchError('検索に失敗しました。もう一度お試しください。');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleExchangeModeToggle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.checked;
    setIsExchangeMode(newMode);
    if (currentSearchQuery) {
      if (newMode) {
        handleExchangeSearch(currentSearchQuery);
      } else {
        handleSearch(currentSearchQuery);
      }
    }
  }, [currentSearchQuery, handleSearch, handleExchangeSearch]);
/*
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery && searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
      if (isExchangeMode) {
        handleExchangeSearch(searchQuery);
      } else {
        handleSearch(searchQuery);
      }
    }
  }, [searchParams, isExchangeMode, handleSearch, handleExchangeSearch, currentSearchQuery]);
*/

  const updateUrlWithSearch = useCallback((query: string) => {
    if (location.pathname !== '/search' || searchParams.get('q') !== query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  }, [navigate, location.pathname, searchParams]);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    const currentPath = location.pathname;

    // タブの設定
    const tabFromPath = 
      currentPath === '/item/favorite' ? 0 : 
      currentPath === '/' ? 1 : 
      currentPath === '/item/new' ? 2 : 
      currentPath === '/search' ? 1 : 0;
    setSelectedTab(tabFromPath);

    // 検索クエリの処理
    if (searchQuery) {
      setCurrentSearchQuery(searchQuery);
      if (isExchangeMode) {
        handleExchangeSearch(searchQuery);
      } else {
        handleSearch(searchQuery);
      }
    } else {
      // 検索クエリがない場合、状態をリセット
      setCurrentSearchQuery(null);
      setSearchResults([]);
      setLastSearchQuery(null);
    }
  }, [location, searchParams, isExchangeMode, handleSearch, handleExchangeSearch]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    const paths = ['item/favorite', '', 'item/new'];
    navigate(`/${paths[newValue]}`);
    setSearchResults([]);
    setLastSearchQuery(null);
  }, [navigate]);

  const onSearch = useCallback((query: string) => {
    updateUrlWithSearch(query);
  }, [updateUrlWithSearch]);
  
  
  useEffect(() => {
    console.log('hasMore changed:', hasMore);
  }, [hasMore]);

  const renderSearchResults = () => {
    if (searchResults.length === 0 && currentSearchQuery) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Typography variant="h6">
            {isExchangeMode 
              ? `"${currentSearchQuery}" に関連する交換可能な商品が見つかりませんでした。`
              : `"${currentSearchQuery}" に関連する商品が見つかりませんでした。`}
          </Typography>
        </Box>
      );
    }

    return (
      <>
        {searchResults.map((item, index) => (
          <MangaListItem
            key={`${isExchangeMode ? 'exchange' : 'search'}-${index}`}
            sellId={item.sellId}
            sellImage={item.sellImage}
            sellTitle={item.sellTitle}
            numberOfBooks={item.numberOfBooks}
            wishTitles={item.wishTitles}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <Header onSearch={onSearch} selectedTab={selectedTab} onTabChange={handleTabChange}/>
      
      <Box sx={{mt:'7rem', pt:`1rem`, pb:`6rem`}}>
        {error && <ErrorDisplay message={error} />}
        {!authState.isInitialized ? (
          <LoadingComponent />
        ) : (
          <>
            {(searchResults.length > 0 || currentSearchQuery) && (
              <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isExchangeMode}
                      onChange={handleExchangeModeToggle}
                      name="exchangeMode"
                      color="primary"
                    />
                  }
                  label="交換モード"
                />
              </Box>
            )}

            {isSearching ? (
              <LoadingComponent />
            ) : (
              renderSearchResults()
            )}

            {!currentSearchQuery && (
              <>
                {selectedTab === 0 && myListData.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 15 }}>
                    <FavoriteIcon sx={{ fontSize: 60, color: 'red', mb:5 }} />
                    <Typography variant="subtitle1">
                      「いいね！」した商品はありません
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 5, mt: 1 }}>
                      商品ページから「いいね！」すると、ここで見ることができます。
                    </Typography>
                    <Button
                      component={Link}
                      to="/"
                      variant="outlined"
                      color="primary"
                      sx={{
                        mt: 3,
                        backgroundColor: 'white',
                        width: '80%',
                        height: 40,
                        fontWeight: '700',
                        fontSize: 16,
                        '&:hover': {
                          backgroundColor: '#ffebee',
                          borderColor: 'darkred',
                          color: 'darkred'
                        }
                      }}
                    >
                      商品を検索する
                    </Button>
                  </Box>
                ) : (
                  (selectedTab === 0 ? myListData : selectedTab === 1 ? recommendData : mangaData).map((item) => (
                    <MangaListItem 
                      key={`tab-${selectedTab}-${item.sellId}`}
                      sellId={item.sellId}
                      sellImage={item.sellImage} 
                      sellTitle={item.sellTitle} 
                      numberOfBooks={item.numberOfBooks}
                      wishTitles={item.wishTitles}
                    />
                  ))
                )}
              </>
            )}
          </>
        )}
        <div ref={ref} style={{ height: '20px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {(isLoadingManga || isLoadingMyList || isLoadingRecommend) && (
            <CircularProgress size={20} style={{ marginRight: '10px' }} />
          )}
          {!isCurrentTabHasMore && searchResults.length === 0 && (
            <Box />
          )}
        </div>
      </Box>
      <MenuBar />
    </>
  );
};

export default MainSearch;
