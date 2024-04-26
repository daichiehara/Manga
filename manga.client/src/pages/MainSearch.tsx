import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import TabsComponent from '../components/common/TabsComponent';
import MangaListItem from '../components/item/MangaListItem';
import Header from '../components/common/Header';
//import MangaImage1 from '../assets/images/MangaImage1.jpg';
import MenuBar from '../components/menu/MenuBar';
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
  //const [selectedTab, setSelectedTab] = useState(0);
  const [mangaData, setMangaData] = useState<MainSearch[]>([]); 
  const [myListData, setMyListData] = useState<MainSearch[]>([]);
  const [RecommendData, setRecommendData] = useState<MainSearch[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  // 新しいステートの追加
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /*
  useEffect(() => {
    const fetchMangaData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://localhost:7103/api/Sells', {
          withCredentials: true
        });
        setMangaData(response.data);
      } catch (error) {
        console.error('データ取得に失敗しました:', error);
        setError('データのロードに失敗しました');
      } finally {
        setLoading(false);
      }
    };
  
    fetchMangaData();
  }, []);  // 空の依存配列を使用して、コンポーネントのマウント時にのみ実行
  */

  useEffect(() => {
    // パスに基づいて selectedTab を更新
    const tabFromPath = location.pathname === '/item/favorite' ? 0 : location.pathname === '/' ? 1 : location.pathname === '/item/new' ? 2 : 0;
    setSelectedTab(tabFromPath);
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/item/favorite') {
      setSelectedTab(0);
    } else if (location.pathname === '/') {
      setSelectedTab(1);
    } else if (location.pathname === '/item/new') {
      setSelectedTab(2);
    }
  }, [location]);

  useEffect(() => {
    if (selectedTab === 0) {
      fetchMyListData();
    } else if (selectedTab === 1) {
      fetchRecommendData();
    } else if (selectedTab === 2) {
      fetchMangaData();
    }
  }, [selectedTab]);  // selectedTabの変更を検知

  const fetchMangaData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7103/api/Sells', {
        withCredentials: true
      });
      setMangaData(response.data);
    } catch (error) {
      console.error('データ取得に失敗しました:', error);
      setError('データのロードに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7103/api/Sells/MyFavorite', {
        withCredentials: true
      });
      setMyListData(response.data);
    } catch (error) {
      console.error('データ取得に失敗しました:', error);
      setError('データのロードに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://localhost:7103/api/Sells/Recommend', {
        withCredentials: true
      });
      setRecommendData(response.data);
    } catch (error) {
      console.error('データ取得に失敗しました:', error);
      setError('データのロードに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query: string) => {
    // 検索処理
  }, []);  // 依存配列が空なので、コンポーネントのライフタイムで一度だけ生成される

  // タブが変更されたときに呼び出される関数
  /*
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);
  */

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
  const MemoizedMangaListItem = React.memo(MangaListItem);


  return (
    <>
      <Header onSearch={handleSearch} selectedTab={selectedTab} onTabChange={handleTabChange}/>
      
      
      
      <Box sx={{mt:'9rem',pt:`1rem`, pb:`6rem`}}>
      {/* データ取得中のインジケーター */}
      {loading && <div>ローディング中...</div>}
      {/* エラーメッセージ */}
      {error && <div>{error}</div>}
      {/* メインコンテンツ */}     
      {selectedTab === 0 && (
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
        )
      )}
      {selectedTab === 1 && (
        RecommendData.map((item, index) => (
          <MangaListItem 
            key={index}
            sellId={item.sellId}
            sellImage={item.sellImage} 
            sellTitle={item.sellTitle} 
            numberOfBooks={item.numberOfBooks}
            wishTitles={item.wishTitles} // 修正
          />
        ))
      )}
      {selectedTab === 2 && (
        mangaData.map((item, index) => (
          <MangaListItem 
            key={index}
            sellId={item.sellId}
            sellImage={item.sellImage} 
            sellTitle={item.sellTitle} 
            numberOfBooks={item.numberOfBooks}
            wishTitles={item.wishTitles} // 修正
          />
        ))
      )}
      </Box>
      <MenuBar />
    </>
  );
};

export default MainSearch;
