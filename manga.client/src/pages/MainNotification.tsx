import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Toolbar, Grid, Card, CardActionArea, CardContent, CardMedia} from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { AuthContext } from '../components/auth/AuthContext';


interface Notification {
  sellId: number;
  message: string;
  sellImage: string;
  updatedDateTime: string
  type:number
}



function timeSince(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval >= 1) {
    return Math.floor(interval) + "年前";
  }
  interval = seconds / 2592000;
  if (interval >= 1) {
    return Math.floor(interval) + "ヶ月前";
  }
  interval = seconds / 86400;
  if (interval >= 1) {
    return Math.floor(interval) + "日前";
  }
  interval = seconds / 3600;
  if (interval >= 1) {
    return Math.floor(interval) + "時間前";
  }
  interval = seconds / 60;
  if (interval >= 1) {
    return Math.floor(interval) + "分前";
  }
  return Math.floor(seconds) + "秒前";
}



const MainNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { authState } = useContext(AuthContext); // 認証状態にアクセス

  useEffect(() => {
    if (!authState.isAuthenticated) return; // ログインしていない場合はAPIコールをスキップ
    // APIから通知データを取得する関数
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://localhost:7103/api/Notifications',{
          withCredentials: true  // クロスオリジンリクエストにクッキーを含める
        });
        // 取得したデータで状態を更新
        setNotifications(response.data);
      } catch (error) {
        console.error('通知データの取得に失敗:', error);
      }
    };
    fetchNotifications();
  }, [authState.isAuthenticated]); // isAuthenticatedに依存しているため、この値が変わるとエフェクトが再実行されます

  // ログインしていない場合の表示
  if (!authState.isAuthenticated) {
    return (
      <>
        {/* 見出しのToolbar */}
        <Toolbar sx={{
          borderBottom: '1px solid #F2F2F2',
          background: '#F2F2F2',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: 0,
          width: '100%',
          zIndex: 1000,
        }}>
          <Typography variant="h6" color="#757575" sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: '600',
          }}>
            お知らせ
          </Typography>
        </Toolbar>
  
        {/* ログイン促進メッセージ */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '64px' /* Toolbarの高さを考慮 */ }}>
          <Typography variant="h5">
            ログインしてください
          </Typography>
        </Box>
  
        {/* ナビゲーションバー */}
        <MenuBar />
      </>
    );
  }
  

  return (
    <>
      {/* メインコンテンツエリア */}
      {/* 見出し */}
      <Toolbar sx={{
        borderBottom: '1px solid #F2F2F2',
        background: '#F2F2F2',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: 0,
        width: '100%',
        zIndex: 1000,
        }}
>
          <Typography variant="h6" color="#757575" sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: '600',
            }}>
            お知らせ
          </Typography>
      </Toolbar>
      
      {/* 通知カードのリスト */}
      <Box sx={{mt: 8, mb: 8}}>
        <Grid container spacing={0.5}>
          {notifications.map((notification, index) => (
            <Grid item xs={12} key={notification.sellId}style={{ 
              borderBottom: index !== notifications.length - 1 ? '1px solid #e0e0e0' : '' 
            }}>
              <Card elevation={0} sx={{ display: 'flex', alignItems: 'center'}}>
                <CardActionArea onClick={() => window.location.href = `/products/${notification.sellId}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 88, height: 70, margin: 2, borderRadius: '10px' }}
                      image={notification.sellImage}
                    />
                    <CardContent sx={{ flexGrow: 1, '&:last-child': { paddingBottom: '8px' }, padding: '4px' }}>
                      <Typography variant="body2" sx={{ fontWeight: '570'}}>
                        {notification.message}
                      </Typography>
                      <Typography variant="body2" color="text.secondary"sx={{fontSize: 12, mt:0.5}}>
                        {timeSince(notification.updatedDateTime)}
                      </Typography>
                    </CardContent>
                    <ArrowForwardIosIcon sx={{ marginRight: 2, fontSize: '24px', color: '#707070'}} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          
        </Grid>
      </Box>

      <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};


export default MainNotification;　