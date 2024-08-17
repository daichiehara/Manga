import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import MangaListItem from '../components/item/MangaListItem';
import Header from '../components/common/Header';
import SearchResults from '../components/common/SearchResults';
import MenuBar from '../components/menu/MenuBar';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { AppContext } from '../components/context/AppContext';
import { AuthContext } from '../components/context/AuthContext';
import { useInView } from 'react-intersection-observer';

interface MainSearchProps {
  initialTab?: number;
}

const MainSearch: React.FC<MainSearchProps> = ({initialTab}) => {
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
  const [selectedTab, setSelectedTab] = useState(initialTab ?? 1);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('q') || sessionStorage.getItem('lastSearchQuery') || '';
  });
  const isCurrentTabHasMore = hasMore[selectedTab];
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '0px 0px 400px 0px'
  });

  const storedQuery = sessionStorage.getItem('lastSearchQuery');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query !== storedQuery)
    {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    sessionStorage.setItem('selectedTab', selectedTab.toString());
  }, [selectedTab]);

  useEffect(() => {
    if (inView && hasMore[selectedTab]) {
      fetchMoreData(selectedTab);
    }
  }, [inView]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }, [navigate]);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    const paths = ['item/favorite', '', 'item/new'];
    navigate(`/${paths[newValue]}`);
    setSelectedTab(newValue);
    sessionStorage.setItem('selectedTab', newValue.toString());
  }, [navigate]);

  useEffect(() => {
    const currentPath = location.pathname;
    const tabFromPath = 
      currentPath === '/item/favorite' ? 0 : 
      currentPath === '/' ? 1 : 
      currentPath === '/item/new' ? 2 : 
      currentPath === '/search' ? selectedTab :
      parseInt(sessionStorage.getItem('selectedTab') || '1', 10);
    
    if (tabFromPath !== selectedTab) {
      setSelectedTab(tabFromPath);
      sessionStorage.setItem('selectedTab', tabFromPath.toString());
    }
  }, [location, selectedTab]);

  const handleSearchStateChange = useCallback((isActive: boolean) => {
    setIsSearchActive(isActive);
  }, []);

  return (
    <>
      <Header 
        onSearch={handleSearch} 
        selectedTab={selectedTab} 
        onTabChange={handleTabChange}
        initialSearchQuery={searchParams.get('q') || ''}
        onClearSearch={() => setSearchQuery('')}
        onSearchStateChange={handleSearchStateChange}
      />
      {searchQuery && <SearchResults query={searchQuery} />}
      <Box sx={{
        mt: isSearchActive ? '4rem' : '7rem',
        pt: `1rem`, 
        pb: `6rem`,
      }}>
        {error && <ErrorDisplay message={error} />}
        {!authState.isInitialized ? (
          <LoadingComponent />
        ) : (
          <>
            {!searchQuery && (
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
                  (selectedTab === 0 ? myListData : selectedTab === 1 ? recommendData : mangaData).map((item, index) => (
                    <MangaListItem 
                      key={`tab-${selectedTab}-index-${index}-sellId-${item.sellId}`}
                      sellId={item.sellId}
                      sellImage={item.sellImage} 
                      sellTitle={item.sellTitle} 
                      numberOfBooks={item.numberOfBooks}
                      wishTitles={item.wishTitles}
                      sellStatus={item.sellStatus}
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
        </div>
      </Box>
      <MenuBar />
    </>
  );
};

export default React.memo(MainSearch);