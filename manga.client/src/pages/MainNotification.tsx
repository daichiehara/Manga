import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia} from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import CustomToolbar from '../components/common/CustumToolbar';
import ExchangeAcceptDrawer from '../components/common/ExchangeAcceptDrawer';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LoadingComponent from '../components/common/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../components/context/NotificationContext';


interface Notification {
  sellId: number;
  message: string;
  sellImage: string;
  updatedDateTime: string;
  type: number;
  title: string;
}

enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Established = 3,
  Draft = 4,
}

interface SellInfoDto {
  sellId: number;
  title: string;
  imageUrl: string;
  sellStatus: SellStatus;
  requestStatus: RequestStatus;
}

enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Withdrawn = 4,
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
  const { 
    notifications, 
    markAllAsRead,
    updateUnreadCount,
    isLoading,
    unreadCount
  } = useContext(NotificationContext);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (authState.isAuthenticated && unreadCount > 0) {
      const handleMarkAllAsRead = async () => {
        await markAllAsRead();
      };
      handleMarkAllAsRead();
    }
  }, [authState.isAuthenticated]);

  const [drawerOpen, setDrawerOpen] = useState(() => {
    const savedState = sessionStorage.getItem('notificationState');
    return savedState ? JSON.parse(savedState).drawerOpen : false;
  });
  const [selectedSellId, setSelectedSellId] = useState<number | null>(() => {
    const savedState = sessionStorage.getItem('notificationState');
    return savedState ? JSON.parse(savedState).selectedSellId : null;
  });
  const [selectedRequesterSells, setSelectedRequesterSells] = useState<{[key: number]: SellInfoDto | null}>(() => {
    const savedState = sessionStorage.getItem('notificationState');
    const parsedState = savedState ? JSON.parse(savedState).selectedRequesterSells : {};
    return Object.keys(parsedState).length > 0 ? parsedState : {};
  });

  const saveState = useCallback(() => {
    const stateToSave = { selectedRequesterSells, drawerOpen, selectedSellId };
    sessionStorage.setItem('notificationState', JSON.stringify(stateToSave));
  }, [selectedRequesterSells, drawerOpen, selectedSellId]);

  const navigate = useNavigate();

  useEffect(() => {
    saveState();
  }, [saveState]);

  const fetchExchangeRequest = useCallback(async (id: number) => {
    try {
      const response = await axios.get(`https://localhost:7103/api/Requests/${id}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('交換リクエストデータの取得に失敗:', error);
      throw error;
    }
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (notification.type === 3) {
      navigate('/mypage/matchedsell');
    } else if (notification.type === 1){
      navigate(`/item/${notification.sellId}/comment`);
    } else {
      setSelectedSellId(notification.sellId);
      setDrawerOpen(true);
    }
  }, [navigate, setSelectedSellId, setDrawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleRequesterSellSelect = useCallback((sell: SellInfoDto | null) => {
    if (selectedSellId) {
      setSelectedRequesterSells(prev => ({
        ...prev,
        [selectedSellId]: sell
      }));
    }
  }, [selectedSellId]);

const handleExchangeConfirmed = useCallback(() => {
  updateUnreadCount();
  setDrawerOpen(false);
}, []);

  if (isLoading) {
    return (
      <>
        <CustomToolbar title='お知らせ' showBackButton={false} />
        <LoadingComponent />
        <MenuBar />
      </>
    );
  }

  // ログインしていない場合の表示
  if (!authState.isAuthenticated) {
    return (
      <>
        {/* 見出しのToolbar */}
        <CustomToolbar title='お知らせ' showBackButton={false} />
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
  //通知がない場合の表示
  if (!Array.isArray(notifications) || notifications.length === 0) {
    return (
      <>
        {/* 見出しのToolbar */}
        <CustomToolbar title='お知らせ' showBackButton={false} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 9 }}>
          <NotificationsNoneIcon sx={{ fontSize: 60, color: 'action.active', padding:9}} />  {/* アイコンのサイズと色、下のマージンを調整 */}
          <Typography variant="subtitle1">
            現在、お知らせはありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ px: 5, mt: 1}}>
            ここではコメントや交換申し込みの通知が表示されます
          </Typography>
        </Box>
        <MenuBar />
      </>
    );
  }
  

  return (
    <>
      {/* メインコンテンツエリア */}
      {/* 見出しのToolbar */}
      <CustomToolbar title='お知らせ' showBackButton={false} />
      
      {/* 通知カードのリスト */}
      <Box sx={{mt: 8, mb: 8}}>
        <Grid container spacing={0.5}>
          {notifications.map((notification, index) => (
            <Grid item xs={12} key={index} style={{ 
              borderBottom: index !== notifications.length - 1 ? '1px solid #e0e0e0' : '' 
            }}>
              <Card elevation={0} sx={{ display: 'flex', alignItems: 'center'}}>
                <CardActionArea onClick={() => handleNotificationClick(notification)}>
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

      <ExchangeAcceptDrawer 
        open={drawerOpen}
        onClose={handleDrawerClose}
        sellId={selectedSellId}
        selectedRequesterSell={selectedSellId ? selectedRequesterSells[selectedSellId] : null}
        onRequesterSellSelect={handleRequesterSellSelect}
        onFetchExchangeRequest={fetchExchangeRequest}
        onExchangeConfirmed={handleExchangeConfirmed}
      />

      <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};


export default MainNotification;