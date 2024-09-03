import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, CardMedia, Grid, Typography , Divider} from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CustomToolbar from '../components/common/CustumToolbar';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import LoadingComponent from '../components/common/LoadingComponent';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

interface MpMatchedSell {
  mySellId: number;
  partnerSellId: number;
  myTitle: string;
  partnerTitle: string;
  myImage: string;
  partnerImage: string;
  matchDate: string;
}

const MpMatchedSellComponent: React.FC = () => {
  const navigate = useNavigate();
  const [mpmatchedSell, setMpMatchedSell] = useState<MpMatchedSell[]>([]);
  const { authState } = useContext(AuthContext); // 認証状態にアクセス
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated) return; // ログインしていない場合はAPIコールをスキップ

    // APIから通知データを取得する関数
    const fetchMpMatchedSell = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/Requests/User`, {
          withCredentials: true  // クロスオリジンリクエストにクッキーを含める
        });
        console.log('取得したデータ:', response.data); // デバッグ用にデータをログに出力
        // 取得したデータで状態を更新
        setMpMatchedSell(response.data);
      } catch (error) {
        console.error('通知データの取得に失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMpMatchedSell();
  }, [authState.isAuthenticated]); // isAuthenticatedに依存しているため、この値が変わるとエフェクトが再実行されます

  function formatTitle(title: string, maxLength: number = 9): string {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    }
    return title;
  }

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', options);
  }

    if (isLoading) {
      <LoadingComponent />
    }

    //通知がない場合の表示
    if (!isLoading && mpmatchedSell.length === 0) {
      return (
        <>
          {/* 見出しのToolbar */}
          <CustomToolbar title='交換した漫画'/>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 9 }}>
            <ImportContactsIcon sx={{ fontSize: 60, color: 'action.active', padding:9}} />  {/* アイコンのサイズと色、下のマージンを調整 */}
            <Typography variant="subtitle1">
              交換した漫画はありません
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ px: 5, mt: 1}}>
              ここでは交換した漫画が表示されます
            </Typography>
          </Box>
        </>
      );
    }
    const description = `[${SERVICE_NAME}]ここでは、交換した漫画のリストを確認できます。過去に交換したアイテムを振り返って、次の取引に役立てましょう。`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - 交換した漫画</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - 交換した漫画`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - 交換した漫画`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomToolbar title="交換した漫画" />
      <Grid container sx={{ pt: { xs: '3.5rem', sm: '4rem', mb: 10  } }}>
      <Grid container>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr:'2rem', pt:'1rem' , pb:'0.5rem' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#707070', textAlign: 'center' }}>
                      自分の出品
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', ml:'2rem', pt:'1rem' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#707070', textAlign: 'center' }}>
                      相手の出品
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
        {mpmatchedSell.map((exchange, index) => (
          <Grid item xs={12} key={exchange.mySellId}>
            <Box
              sx={{
                p: 0.5,
                pb: '1rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#707070', textAlign: 'center', pt:'0.5rem' }}>
                  {formatDate(exchange.matchDate)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <ButtonBase
                  onClick={() => navigate(`/item/${exchange.mySellId}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2,
                    width: '70%', // 固定幅
                    textAlign: 'center',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 50, height: 50, borderRadius: '5px', objectFit: 'cover' }}
                    image={exchange.myImage}
                    alt={exchange.myTitle}
                  />
                  <Typography variant="subtitle2" sx={{ mt: 1 }} >
                    {formatTitle(exchange.myTitle)}
                  </Typography>
                </ButtonBase>
                <SyncAltIcon sx={{ mx: 2, fontSize: 40 }} color='primary' />
                <ButtonBase
                  onClick={() => navigate(`/item/${exchange.partnerSellId}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2,
                    width: '70%', // 固定幅
                    textAlign: 'center',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 50, height: 50, borderRadius: '5px', objectFit: 'cover' }}
                    image={exchange.partnerImage}
                    alt={exchange.partnerTitle}
                  />
                  <Typography variant="subtitle2" sx={{ mt: 1 }} >
                    {formatTitle(exchange.partnerTitle)}
                  </Typography>
                </ButtonBase>
              </Box>
            </Box>
            <Divider variant= "middle"  />
          </Grid>
        ))}
      </Grid>
    </HelmetProvider>
  );
};

export default MpMatchedSellComponent;
