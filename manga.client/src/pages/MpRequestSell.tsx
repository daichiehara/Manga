import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import RequestedSellDrawer from '../components/common/RequestedSellDrawer';
import LoadingComponent from '../components/common/LoadingComponent';
import theme from '../theme/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Withdrawn = 4,
}

interface RequestedSell {
    sellId: number;
    title: string;
    imageUrl: string;
    created: string;
    status: number;
    requesterSells: Array<{ sellId: number; title: string; status: RequestStatus }>; // '?' を削除
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

interface StatusStyle {
  text: string;
  color: string;
}

function getStatusStyle(status: number): StatusStyle {
  switch (status) {
    case 1:
      return { text: "申請中", color: "#4EA72E" };
    case 2:
      return { text: "交換成立", color: theme.palette.info.main };
    case 3:
      return { text: "拒否されました", color: "red" };
    case 4:
      return { text: "申請取り下げ", color: "secondary" };
    default:
      return { text: "", color: "inherit" };
  }
}

const RequestedSellList: React.FC = () => {
    const [requestedSells, setRequestedSells] = useState<RequestedSell[]>([]);
    const [selectedSell, setSelectedSell] = useState<RequestedSell | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { authState } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authState.isAuthenticated) {
        setIsLoading(false);
        return;
    }
    const fetchRequestedSells = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/Sells/RequestedSell`, {
            withCredentials: true
            });
            setRequestedSells(response.data);
        } catch (error) {
            console.error('リクエストした出品の取得に失敗:', error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchRequestedSells();
  }, [authState.isAuthenticated]);

  const handleSellClick = async (sell: RequestedSell) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Sells/RequestedSell/${sell.sellId}`, {
        withCredentials: true
      });
      setSelectedSell({
        ...sell,
        requesterSells: response.data.requesterSells
      });
      setDrawerOpen(true);
    } catch (error) {
      console.error('交換申請詳細の取得に失敗:', error);
    }
  };

  const handleOpen = () => {
    // ドロワーを開く処理
  };

  if (isLoading) {
    return (
      <>
        <CustomToolbar title='交換申請した漫画' />
        <LoadingComponent />
      </>
    );
  }

  if (requestedSells.length === 0) {
    return (
      <>
        <CustomToolbar title='交換申請した漫画' />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 9 }}>
          <ForwardToInboxRoundedIcon sx={{ fontSize: 60, color: 'action.active', padding: 9 }} />
          <Typography variant="subtitle1">
            交換申請中の漫画はありません
          </Typography>
        </Box>
      </>
    );
  }
  const description = `[${SERVICE_NAME}]交換申請した漫画のリストを確認し、申請のステータスを管理できます。`;
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - 交換申請した漫画</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - 交換申請した漫画`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - 交換申請した漫画`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomToolbar title='交換申請した漫画' />
      <Box sx={{ mt: '3.5rem', mb: 10 }}>
        <Grid container>
          {requestedSells.map((item, index) => (
            <Grid item xs={12} key={index} style={{
              borderBottom: index !== requestedSells.length - 1 ? '1px solid #e0e0e0' : ''
            }}>
              <Card elevation={0} sx={{ display: 'flex', alignItems: 'center' }}>
              <CardActionArea onClick={() => handleSellClick(item)}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 70,
                        height: 70,
                        margin: 2,
                        borderRadius: '5px',
                        objectFit: 'cover'
                      }}
                      image={item.imageUrl}
                    />
                    <CardContent sx={{ flexGrow: 1, '&:last-child': { paddingBottom: '8px' }, padding: '9px' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: '580' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 0.5 }}>
                        {timeSince(item.created)}
                      </Typography>
                      <Chip
                        label={getStatusStyle(item.status).text}
                        size="small"
                        variant="outlined"
                        style={{
                          color: getStatusStyle(item.status).color,
                          borderColor: getStatusStyle(item.status).color,
                          padding: '1px 2px',
                          fontSize: '0.7rem',
                          borderWidth: '1px'
                        }}
                      />
                    </CardContent>
                    <ArrowForwardIosIcon sx={{ marginRight: 2, fontSize: '24px', color: '#707070' }} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <RequestedSellDrawer
        open={drawerOpen}
        onOpen={handleOpen}
        onClose={() => setDrawerOpen(false)}
        requestedSell={selectedSell}
      />
    </HelmetProvider>
  );
};

export default RequestedSellList;