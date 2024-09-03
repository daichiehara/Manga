import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
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
import NavigateToLoginBox from '../components/login/NavigateToLoginBox';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

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
  const navigate = useNavigate();

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


  useEffect(() => {
    saveState();
  }, [saveState]);

  const fetchExchangeRequest = useCallback(async (id: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Requests/${id}`, {
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

  const renderNotification = useCallback((notification: Notification, index: number) => {

    return (
      <Grid item xs={12} key={index} style={{ 
        borderBottom: index !== notifications.length - 1 ? '1px solid #e0e0e0' : '' 
      }}>
        <Card elevation={0} sx={{ display: 'flex', alignItems: 'center'}}>
          <CardActionArea onClick={() => handleNotificationClick(notification)}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{margin: 2}}>
                <CardMedia
                  component="img"
                  sx={{ width: 70, height: 70, borderRadius: '10px', backgroundColor: 'grey.300', }}
                  image={notification.sellImage}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1, '&:last-child': { paddingBottom: '8px' }, padding: '4px' }}>
                <Typography variant="body2" sx={{ fontWeight: '570'}}>
                  {notification.message}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{fontSize: 12, mt:0.5}}>
                  {timeSince(notification.updatedDateTime)}
                </Typography>
              </CardContent>
              <ArrowForwardIosIcon sx={{ marginRight: 2, fontSize: '24px', color: '#707070'}} />
            </Box>
          </CardActionArea>
        </Card>
      </Grid>
    );
  }, [handleNotificationClick]);

  const memoizedNotifications = useMemo(() => {
    return notifications.map((notification, index) => 
      renderNotification(notification, index)
    );
  }, [notifications, renderNotification]);

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
        <NavigateToLoginBox height='80vh'/>
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
  const description = `[トカエル]このページでは、コメントや交換申し込みなどの通知を確認できます。`;


  return (
    <HelmetProvider>
      <Helmet>
        <title>お知らせ - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="お知らせ" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="お知らせ" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
        
      <CustomToolbar title='お知らせ' showBackButton={false} />
      
      <Box sx={{mt: 8, mb: 8}}>
        <Grid container spacing={0.5}>
          {memoizedNotifications}
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

      <MenuBar />
    </HelmetProvider>
  );
};


export default MainNotification;