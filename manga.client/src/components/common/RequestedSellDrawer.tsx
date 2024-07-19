import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Link, Button, SwipeableDrawer, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import theme from '../../theme/theme';

enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Withdrawn = 4,
}

interface RequestedSellDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  requestedSell: {
    sellId: number;
    title: string;
    requesterSells: Array<{ sellId: number; title: string; status: RequestStatus }>;
  } | null;
}

const RequestedSellDrawer: React.FC<RequestedSellDrawerProps> = ({ open, onClose, onOpen, requestedSell }) => {
  const navigate = useNavigate();

  if (!requestedSell) return null;

  const handleNavigateToDetails = (itemId: number) => {
    navigate(`/item/${itemId}`);
    onClose();
  };

  return (
    <SwipeableDrawer 
      anchor="bottom" 
      open={open} 
      onClose={onClose} 
      onOpen={onOpen}
      disableBackdropTransition
      disableDiscovery
      disableSwipeToOpen={false}
      swipeAreaWidth={0}
      disableScrollLock
      PaperProps={{
        style: {
          maxHeight: '70%',
          width: '100%',
          maxWidth: '640px',
          margin: 'auto',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center', alignItems: 'center' }}>
        <Typography variant="h6" sx={{pb: 3, color:'#0F9ED5', fontWeight: 'bold'}}>
          相手の漫画
        </Typography>
        <Link
          component="button"
          variant="body1"
          onClick={() => handleNavigateToDetails(requestedSell.sellId)}
          sx={{pb: 4, textDecoration: 'none', color: 'inherit'}}
        >
          {requestedSell.title}
        </Link>
        <KeyboardDoubleArrowUpIcon sx={{fontSize: '48px', pb: 4}} />
        <Typography variant="h6" gutterBottom sx={{color: '#EB4848', fontWeight: 'bold'}}>
          あなたの漫画
        </Typography>
        <List sx={{ overflowY: 'auto', width: '100%' }}>
          {requestedSell.requesterSells.map((sell) => (
            <ListItemButton 
              key={sell.sellId} 
              onClick={() => handleNavigateToDetails(sell.sellId)}
              sx={{ 
                textAlign: 'center',
                backgroundColor: sell.status === RequestStatus.Approved ? '#e3f2fd' : 'inherit', // 薄い青色の背景に変更
                '&:hover': {
                  backgroundColor: sell.status === RequestStatus.Approved ? '#bbdefb' : 'rgba(0, 0, 0, 0.04)', // ホバー時の色も青系に変更
                },
              }}
            >
              <ListItemText 
                primary={sell.title} 
                secondary={
                  sell.status === RequestStatus.Approved && (
                    <Typography component="div">
                      <Chip 
                        label="交換成立" 
                        size="small" 
                        sx={{ 
                          mt: 1, 
                          bgcolor: theme.palette.info.main,
                          color: 'white'
                        }} 
                      />
                    </Typography>
                  )
                }
              />
            </ListItemButton>
          ))}
        </List>
        <Button 
          variant="contained" 
          color="primary" 
          size='large'
          fullWidth
          onClick={() => handleNavigateToDetails(requestedSell.sellId)}
          sx={{ mt: 2 }}
        >
          商品詳細・キャンセル
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default React.memo(RequestedSellDrawer);