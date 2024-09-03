import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, FormControlLabel, Switch, CircularProgress, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import TuneIcon from '@mui/icons-material/Tune';
import MangaListItem from '../item/MangaListItem';
import MyBookModal from '../common/MyBookModal';
import { useInView } from 'react-intersection-observer';
import { SERVICE_NAME } from '../../serviceName';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { API_BASE_URL } from '../../apiName';

enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Establish = 3,
  Draft = 4,
}
interface MainSearch {
  sellId: number;
  sellTitle: string;
  numberOfBooks: number;
  sellStatus: SellStatus;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const fetchResults = async (currentPage: number, exchangeMode: boolean, recruitingOnly: boolean) => {
    if (!query) return;
  
    setError(null);
    try {
      setIsLoading(true);
        console.log(`Fetching results with isExchangeMode: ${exchangeMode}, onlyRecruiting: ${recruitingOnly}`);
      const endpoint = exchangeMode
        ? `${API_BASE_URL}/Sells/SearchByTitleForExchange`
        : `${API_BASE_URL}/Sells/SearchByWord`;
  
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

    const handleModalToggle = useCallback(() => {
        setIsModalOpen(prev => !prev);
      }, []);

    const handleFilterClick = () => {
        // TODO: 絞り込み機能の実装
        handleModalToggle();
        console.log('絞り込みボタンがクリックされました');
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
    
      const description = `[${SERVICE_NAME}] "${query}" に関連する出品の検索結果です。出品をクリックして詳細を確認してみましょう！`;
      
  return (
    <HelmetProvider>
      <Helmet>
        <title>検索結果 - {query} | {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`検索結果 - ${query} | ${SERVICE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`検索結果 - ${query} | ${SERVICE_NAME}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>

      <Box sx={{ pt: 11, mb: 2 }}>
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
            label="出品中"
          />
          <Stack direction="row" alignItems="center">
            <IconButton size="small" sx={{p: 0}}>
                <SearchIcon />
              </IconButton>
              <Switch
                checked={isExchangeMode}
                onChange={handleExchangeModeToggle}
                name="exchangeMode"
                color="primary"
              />
              <IconButton size="small" sx={{p: 0}}>
                <AutoStoriesIcon />
              </IconButton>
          </Stack>
              <Box 
                  sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      ml: 2,
                      cursor: 'pointer', // カーソルをポインターに変更
                      '&:hover': {
                      opacity: 0.7, // ホバー時の視覚的フィードバック
                      },
                  }}
                  onClick={handleFilterClick} // 全体にクリックイベントを追加
                  >
                  <Box 
                      sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)', // ホバー時の背景色変更
                      },
                      }}
                  >
                      <TuneIcon />
                  </Box>
                  <Typography variant="caption">絞り込み</Typography>
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
              sellStatus={item.sellStatus}
              onItemClick={handleItemClick}
            />
          ))
        )}
        
        <div ref={ref} style={{ height: '20px', margin: '20px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isLoading && (
            <CircularProgress size={20} style={{ marginRight: '10px' }} />
          )}
        </div>

        <MyBookModal isOpen={isModalOpen} onClose={handleModalToggle} />
      </Box>
    </HelmetProvider>
  );
};

export default SearchResults;