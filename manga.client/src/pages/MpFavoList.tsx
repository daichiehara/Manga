import {  useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import MangaListItem from '../components/item/MangaListItem';
import { Box, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LoadingComponent from '../components/common/LoadingComponent';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Establish = 3,
  Draft = 4,
}
interface MainMpFavoList {
  sellId: number;
  sellTitle: string;
  numberOfBooks: number;
  sellStatus: SellStatus;
  wishTitles: {
    title: string;
    isOwned: boolean;
  }[];
  sellImage: string;
  title: string; 
}

const MainMpFavoList: React.FC = () => {
  const [selectedTab] = useState(0);
  const [mangaData, setMangaData] = useState<MainMpFavoList[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

    // AuthContextから認証状態を安全に取得
    const authContext = useContext(AuthContext);
    const isAuthenticated = authContext ? authContext.authState.isAuthenticated : false;
  
    useEffect(() => {
      
      console.log('ログイン状態:', isAuthenticated); // ログイン状態をコンソールに表示
  
      const fetchMangaData = async () => {
        try {
          setIsLoading(true);
          console.log('APIリクエストを送信中...');
          const response = await axios.get(`${API_BASE_URL}/Sells/MyFavorite`, {
            withCredentials: true  // クロスオリジンリクエストにクッキーを含める
          });
          console.log('レスポンス受信:', response.status, response.statusText);
          console.log('取得したデータ:', response.data);
          console.log('ログイン状態:', isAuthenticated); // ログイン状態をコンソールに表示
          setMangaData(response.data);
        } catch (error) {
          console.error('データ取得に失敗しました:', error);
          setError('Failed to load data. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchMangaData();
    }, [isAuthenticated]); // 空の依存配列を指定して、コンポーネントのマウント時にのみ実行

    if (isLoading) {
      return (
        <>
          <CustomToolbar title='いいね！一覧'/>
          <LoadingComponent />
        </>
      );
    }
    const description = `[${SERVICE_NAME}]あなたが「いいね！」した出品の一覧をご覧いただけます。`;

  return (
    <>
      <Helmet>
        <title>いいね！一覧 - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`いいね！一覧 - ${SERVICE_NAME}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content={`いいね！一覧 - ${SERVICE_NAME}`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      {/* 見出しのToolbar */}
      <CustomToolbar title='いいね！一覧'/>
      <Box sx={{ pt: 7, paddingBottom: 6 }}>
        {mangaData.length > 0 ? (
          mangaData.map((item, index) => (
            <MangaListItem
              key={index}
              sellId={item.sellId}
              sellImage={item.sellImage}
              sellTitle={item.sellTitle}
              numberOfBooks={item.numberOfBooks}
              wishTitles={item.wishTitles}
              sellStatus={item.sellStatus}
            />
          ))
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 15 }}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'red', mb:5}} /> {/* ハートアイコンの設定 */}
          <Typography variant="subtitle1" >
            「いいね！」した商品はありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ px: 5, pt: 1}}>
            商品ページから「いいね！」すると、ここで見ることができます。
          </Typography>

          {/* 検索ページに推移するボタン */}
          <Button
          component={Link}
          to="/"
          variant="outlined" // 枠線のあるボタンスタイルを指定
          color="primary" sx={{
            mt: 3,

            backgroundColor: 'white', // 背景色を白に設定
            width: '80%', 
            height: 40, 
            fontWeight: '700',
            fontSize: 16,
            '&:hover': 
            { backgroundColor: '#ffebee', // ホバー時の背景色を薄い赤に設定
            borderColor: 'darkred', // ホバー時の枠線色を濃い赤に変更
            color: 'darkred' // ホバー時のテキスト色を濃い赤に変更
           }
            }}
            >
              商品を検索する
          </Button>
        </Box>
        )}
        {selectedTab === 1 && <Box>MyList content goes here...</Box>}
      </Box>
    </>
  );
};

export default MainMpFavoList;
