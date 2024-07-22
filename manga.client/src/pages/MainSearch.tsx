import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import TabsComponent from '../components/common/TabsComponent';
import MangaListItem from '../components/item/MangaListItem';
import Header from '../components/common/Header';
//import MangaImage1 from '../assets/images/MangaImage1.jpg';
import MenuBar from '../components/menu/MenuBar';
import LoadingComponent from '../components/common/LoadingComponent';
import axios from 'axios';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { AppContext } from '../components/context/AppContext';
import { AuthContext } from '../components/context/AuthContext';

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
    error 
  } = useContext(AppContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  
  useEffect(() => {
    const tabFromPath = location.pathname === '/item/favorite' ? 0 : location.pathname === '/' ? 1 : location.pathname === '/item/new' ? 2 : 0;
    setSelectedTab(tabFromPath);
  }, [location]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate('/item/favorite');
    } else if (newValue === 1) {
      navigate('/');
    } else if (newValue === 2) {
      navigate('/item/new');
    }
  }, [navigate]);

  const handleSearch = useCallback((query: string) => {
    // 検索処理
  }, []);  // 依存配列が空なので、コンポーネントのライフタイムで一度だけ生成される

  
  const isCurrentTabLoading = () => {
    if (selectedTab === 0) return isLoadingMyList;
    if (selectedTab === 1) return isLoadingManga;
    if (selectedTab === 2) return isLoadingRecommend;
    return false;
  };

  return (
    <>
      <Header onSearch={handleSearch} selectedTab={selectedTab} onTabChange={handleTabChange}/>
      
      <Box sx={{mt:'7rem',pt:`1rem`, pb:`6rem`}}>
        {error && <ErrorDisplay message={error} />}
        {!authState.isInitialized ? (
          <LoadingComponent />
        ) : (
          <>
              {selectedTab === 0 && (
                isLoadingMyList ? (
                  <LoadingComponent />
                ) : (
                myListData.length > 0 ? (
                myListData.map((item, index) => (
                  <MangaListItem
                    key={index}
                    sellId={item.sellId}
                    sellImage={item.sellImage}
                    sellTitle={item.sellTitle}
                    numberOfBooks={item.numberOfBooks}
                    wishTitles={item.wishTitles}
                  />
                ))
              ) : (
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
            ))
          )}
          {selectedTab === 1 && (
            isLoadingRecommend ? (
              <LoadingComponent />
            ) : (
              recommendData.map((item, index) => (
                <MangaListItem 
                  key={index}
                  sellId={item.sellId}
                  sellImage={item.sellImage} 
                  sellTitle={item.sellTitle} 
                  numberOfBooks={item.numberOfBooks}
                  wishTitles={item.wishTitles}
                />
              )))
            )}
            {selectedTab === 2 && (
              isLoadingManga ? (
                <LoadingComponent />
              ) : (
              mangaData.map((item, index) => (
                <MangaListItem 
                  key={index}
                  sellId={item.sellId}
                  sellImage={item.sellImage} 
                  sellTitle={item.sellTitle} 
                  numberOfBooks={item.numberOfBooks}
                  wishTitles={item.wishTitles}
                />
              )))
            )}
          </>
        )}
      </Box>
      <MenuBar />
    </>
  );
};

export default MainSearch;
