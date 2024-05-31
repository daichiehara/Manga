import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, CardMedia, Grid, Typography } from '@mui/material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CustomToolbar from '../components/common/CustumToolbar';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';

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
  

  useEffect(() => {
    if (!authState.isAuthenticated) return; // ログインしていない場合はAPIコールをスキップ

    // APIから通知データを取得する関数
    const fetchMpMatchedSell = async () => {
      try {
        const response = await axios.get('https://localhost:7103/api/Requests/User', {
          withCredentials: true  // クロスオリジンリクエストにクッキーを含める
        });
        console.log('取得したデータ:', response.data); // デバッグ用にデータをログに出力
        // 取得したデータで状態を更新
        setMpMatchedSell(response.data);
      } catch (error) {
        console.error('通知データの取得に失敗:', error);
      }
    };

    fetchMpMatchedSell();
  }, [authState.isAuthenticated]); // isAuthenticatedに依存しているため、この値が変わるとエフェクトが再実行されます

  function formatTitle(title: string, maxLength: number = 5): string {
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

  return (
    <>
      <CustomToolbar title="交換した漫画" />
      <Grid container sx={{ pt: { xs: '3.5rem', sm: '4rem', mb: 10  } }}>
      <Grid container>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr:'2rem', pt:'1rem'  }}>
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
                borderBottom: index !== mpmatchedSell.length - 1 ? '2px solid #eee' : 'none',
                backgroundColor: 'white',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#707070', textAlign: 'center' }}>
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
                    sx={{ width: 70, height: 70, borderRadius: '5px', objectFit: 'cover' }}
                    image={exchange.myImage}
                    alt={exchange.myTitle}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {formatTitle(exchange.myTitle)}
                  </Typography>
                </ButtonBase>
                <SyncAltIcon sx={{ mx: 2, color: 'action.active', fontSize: 40 }} />
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
                    sx={{ width: 70, height: 70, borderRadius: '5px', objectFit: 'cover' }}
                    image={exchange.partnerImage}
                    alt={exchange.partnerTitle}
                  />
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    {formatTitle(exchange.partnerTitle)}
                  </Typography>
                </ButtonBase>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default MpMatchedSellComponent;
