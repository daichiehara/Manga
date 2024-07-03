import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia, Chip } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import PanToolIcon from '@mui/icons-material/PanTool';
import RequestedSellDrawer from '../components/common/RequestedSellDrawer';

interface RequestedSell {
    sellId: number;
    title: string;
    imageUrl: string;
    created: string;
    status: number;
    requesterSells: Array<{ itemId: number; title: string }>; // '?' を削除
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
      return { text: "承認済み", color: "blue" };
    case 3:
      return { text: "拒否されました", color: "red" };
    default:
      return { text: "", color: "inherit" };
  }
}

const RequestedSellList: React.FC = () => {
    const [requestedSells, setRequestedSells] = useState<RequestedSell[]>([]);
    const [selectedSell, setSelectedSell] = useState<RequestedSell | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!authState.isAuthenticated) return;
    const fetchRequestedSells = async () => {
      try {
        const response = await axios.get('https://localhost:7103/api/Sells/RequestedSell', {
          withCredentials: true
        });
        setRequestedSells(response.data);
      } catch (error) {
        console.error('リクエストした出品の取得に失敗:', error);
      }
    };
    fetchRequestedSells();
  }, [authState.isAuthenticated]);

  const handleSellClick = async (sell: RequestedSell) => {
    try {
      const response = await axios.get(`https://localhost:7103/api/Sells/RequestedSell/${sell.sellId}`, {
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

  if (requestedSells.length === 0) {
    return (
      <>
        <CustomToolbar title='交換申請した漫画' />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pt: 9 }}>
          <PanToolIcon sx={{ fontSize: 60, color: 'action.active', padding: 9 }} />
          <Typography variant="subtitle1">
            交換申請をした漫画はありません
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <CustomToolbar title='交換申請した漫画' />
      <Box sx={{ mt: '3.5rem', mb: 10 }}>
        <Grid container>
          {requestedSells.map((item, index) => (
            <Grid item xs={12} key={item.sellId} style={{
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
        onClose={() => setDrawerOpen(false)}
        requestedSell={selectedSell}
      />
    </>
  );
};

export default RequestedSellList;